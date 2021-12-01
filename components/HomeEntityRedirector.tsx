// it's not possible to handle the old addresses by nginx. UPDATE: it's possible with njs
// https://serverfault.com/questions/714232/nginx-discards-data-after-number-sign/714245
import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import queryString, { ParsedUrlQuery } from 'querystring'
import isEmpty from 'lodash/isEmpty'
import { StatusCodes } from 'http-status-codes'
import { BASICS_ENDPOINTS } from '../api/endpoints/BasicsEndpoints'
import { convertQueryParamToArray, convertQueryParamToString } from '../utils/utils'
import { BriefRootSlugEntity } from '../utils/types'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'


const SELF = '/'


const adaptParams = async (_entry: string, query: ParsedUrlQuery): Promise<ParsedUrlQuery> => {
  const SEP = ','

  // https://blog.vonmorgen.org/en/iframe/
  const {
    center,
    entry,
    z: zoom,
    dropdowns,
    orgTag,
    fixedTags,
    left,
  } = query

  // todo: we'll take the first bullet since there are just limited types
  let eventRequest = null
  let entryRequest = null
  if (entry) {
    eventRequest = fetch(`${BASICS_ENDPOINTS.getEvent()}/${entry}`)
    entryRequest = fetch(`${BASICS_ENDPOINTS.getEntries()}/${entry}`)
  }

  // eliminate empty values params
  const newParams = Object.keys({
    z: zoom,
    dropdowns,
    orgTag,
    fixedTags,
    left,
  })
    .reduce((params, p) => {
      if (!isEmpty(query[p])) {
        params[p] = query[p]
      }

      return params
    }, {})

  const [lat, lng] = convertQueryParamToString(center).split(SEP)
  const centerCoord = { lat, lng }
  Object.keys(centerCoord).forEach((k) => {
    if (!isEmpty(centerCoord)) {
      newParams[k] = centerCoord[k]
    }
  })

  const paramsToArray = ['fixedTags']
  paramsToArray.forEach((p) => {
    if (!isEmpty(newParams[p])) {
      const stringQueryParam = convertQueryParamToString(newParams[p])
      newParams[p] = stringQueryParam.split(SEP)
    }
  })

  // time to check what we have, an entry or an event
  let entitySlug = ''
  if (eventRequest || entryRequest) {
    try {
      const entryResponse = await entryRequest
      if (entryResponse.status === StatusCodes.OK) {
        const entryResponseJson = await entryResponse.json()
        if (entryResponseJson.length !== 0) {
          entitySlug = BriefRootSlugEntity.ENTRIES
        } else {
          const eventResponse = await eventRequest
          if (eventResponse.status === StatusCodes.OK) {
            entitySlug = BriefRootSlugEntity.EVENTS
          }
        }
      }
    } catch (e) {

    }
  }

  newParams['slug'] = ['maps', 'fromhome']
  if (entitySlug.length !== 0) {
    newParams['slug'].push(entitySlug)
    newParams['slug'].push(entry)
  }

  return newParams
}

const getRedirectDomain = (entry: string): [string, boolean] => {
  const mapper = {
    '': SELF,
    'renn.html': process.env.NEXT_PUBLIC_OLD_DOMAIN,
    'businesscard.html': process.env.NEXT_PUBLIC_OLD_DOMAIN,
    'map.html': process.env.NEXT_PUBLIC_OLD_DOMAIN,
    'mapAndEntryList.html': process.env.NEXT_PUBLIC_OLD_DOMAIN,
  }

  if (mapper.hasOwnProperty(entry)) {
    return [mapper[entry], true]
  }

  return ['', false]
}

const HomeEntityRedirector: FC = () => {
  const router = useRouter()
  const { query, asPath: path } = router
  const slug = convertQueryParamToArray(query.slug)

  let entry = ''
  if (slug.length !== 0 && slug[0] !== '[[...slug]]') {
    entry = slug[0]
  }

  useEffect(() => {
    const entryPath = `/${entry}#/?`
    // check if it's coming from the old domain
    if (path.startsWith(entryPath)) {
      const [redirectDomain, isValidEntry] = getRedirectDomain(entry)
      if (!isValidEntry) {
        router.replace('/', undefined, { shallow: true })
      }

      if (redirectDomain !== SELF) {
        router.replace(`${redirectDomain}/${path}`)
      }

      const qs = path.slice(entryPath.length)
      const query = queryString.parse(qs)
      adaptParams(entry, query).then((newQueryParams) => {
        const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

        router.push(
          {
            pathname: `/${newPath}`,
            query: newQueryWithoutSlug,
          },
          undefined,
          { shallow: false },
        )
      })
    }
  }, [path])

  return null
}


export default HomeEntityRedirector

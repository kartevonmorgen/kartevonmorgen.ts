// it's not possible to handle the old addresses by nginx. UPDATE: it's possible with njs
// https://serverfault.com/questions/714232/nginx-discards-data-after-number-sign/714245
import { FC, useEffect } from 'react'
import { NextRouter, useRouter } from 'next/router'
import queryString, { ParsedUrlQuery } from 'querystring'
import pickBy from 'lodash/pickBy'
import { StatusCodes } from 'http-status-codes'
import { BASICS_ENDPOINTS } from '../api/endpoints/BasicsEndpoints'
import { BriefRootSlugEntity, SlugVerb } from '../utils/types'
import SidebarStatus from '../dtos/SidebarStatus'
import { convertArrayToQueryParam, convertQueryParamToString } from '../utils/utils'


const extractTagsFromSearchQuery = (search: string): [string, string[]] => {
  if (!search) {
    return [search, []]
  }

  const tokens = search.split(' ')
  const tags: string[] = []
  let newSearch = ''
  tokens.forEach(token => {
    if (token.startsWith('#')) {
      tags.push(token.substring(1))

      return
    }

    newSearch = `${newSearch} ${token}`
  })

  newSearch = newSearch.trim()

  return [newSearch, tags]
}


const adaptParams = (query: ParsedUrlQuery): ParsedUrlQuery => {
  // https://blog.vonmorgen.org/en/iframe/
  const {
    center: c,
    zoom: z,
    search: searchParam,
    categories: type,
    orgTag,
    fixedTags,
    left: sidebar,
    addentry,
  } = query

  const search = convertQueryParamToString(searchParam)
  const [newSearch, tagsFromSearchInput] = extractTagsFromSearchQuery(search)

  const optionalAdaptedParams = {
    c,
    z,
    search: newSearch,
    type,
    tag: convertArrayToQueryParam(tagsFromSearchInput),
    orgTag,
    fixedTags,
    sidebar: sidebar === 'hide' ? SidebarStatus.HIDDEN : undefined,
    addentry,
  }

  const adaptedParams = pickBy(optionalAdaptedParams, (value) => !!value)

  return adaptedParams
}

const getEntityType = async (query: ParsedUrlQuery): Promise<BriefRootSlugEntity> => {
  const { entry } = query

  if (!entry) {
    return BriefRootSlugEntity.RESULTS
  }

  // time to check what we have, an entry or an event
  try {
    const entryResponse = await fetch(`${BASICS_ENDPOINTS.getEntries()}/${entry}`)
    if (entryResponse.status === StatusCodes.OK) {
      const entryResponseJson = await entryResponse.json()
      if (entryResponseJson.length !== 0) {
        return BriefRootSlugEntity.ENTRIES
      }
    }
  } catch (e) {
  }

  try {
    const eventResponse = await fetch(`${BASICS_ENDPOINTS.getEvent()}/${entry}`)
    if (eventResponse.status === StatusCodes.OK) {
      return BriefRootSlugEntity.EVENTS
    }
  } catch (e) {

  }

  return BriefRootSlugEntity.RESULTS
}

const isFromOldDomain = (path: string): boolean => {
  return path.startsWith('/#')
}

const createNewPath = (
  project: string,
  rootEntityType: BriefRootSlugEntity,
  entityId: string,
  query: ParsedUrlQuery
): string => {
  const {addentry} = query

  let path = `/m/${project}`

  if (addentry) {
    return `${path}/e/${SlugVerb.CREATE}`
  }

  if (rootEntityType !== BriefRootSlugEntity.RESULTS) {
    path = `${path}/${rootEntityType}/${entityId}`
  }

  return path
}

const redirectToMap = (router: NextRouter, path: string, params: ParsedUrlQuery) => {
  router.push({
    pathname: path,
    query: params
  })

}

const HomeEntityRedirector: FC = () => {
  const router = useRouter()
  const { asPath: path } = router

  useEffect(() => {
    if (!isFromOldDomain(path)) {
      return
    }

    const startCharsToRemove: string = `/#/?`
    let numberOfCharsToDrop = 0
    for (numberOfCharsToDrop; numberOfCharsToDrop != startCharsToRemove.length; numberOfCharsToDrop++) {
      if (startCharsToRemove[numberOfCharsToDrop] !== path[numberOfCharsToDrop]) {
        break
      }
    }
    const trimmedPath = path.substring(numberOfCharsToDrop)

    const query = queryString.parse(trimmedPath)
    const {dropdowns, entry: entryParam} = query

    const adaptedParams = adaptParams(query)

    const project: string = convertQueryParamToString(dropdowns) || 'main'
    const entryId = convertQueryParamToString(entryParam)

    getEntityType(query).then(entityType => {
      const newPath = createNewPath(project, entityType, entryId, adaptedParams)

      redirectToMap(router, newPath, adaptedParams)
    })

  }, [path])

  return null
}


export default HomeEntityRedirector

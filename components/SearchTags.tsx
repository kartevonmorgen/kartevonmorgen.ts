import React, { FC, Fragment, useEffect, useRef, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'
import produce from 'immer'
import lodashIsEqual from 'lodash/isEqual'
import {
  convertArrayToQueryParam,
  convertQueryParamToArray,
  removeRoutingQueryParams,
  updateRoutingQuery,
} from '../utils/utils'
import TagsSelect from './TagsSelect'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'
import useTranslation from 'next-translate/useTranslation'


const addTagToRouter = (router: NextRouter) => (tag: string) => {
  const { query } = router
  const { tag: optionalTagsFromQuery } = query
  const optionalTags = convertQueryParamToArray(optionalTagsFromQuery)

  const newTags = !optionalTags.includes(tag) ? [...optionalTags, tag] : optionalTags

  const newQueryParams = updateRoutingQuery(query, { tag: convertArrayToQueryParam(newTags) })
  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  router.replace(
    {
      pathname: `/m/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )
}


const removeAllTagsFromRouter = (router: NextRouter) => () => {
  const { query } = router
  const newQueryParams = removeRoutingQueryParams(query, ['tag'])
  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  router.replace(
    {
      pathname: `/m/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )
}


const removeTagFromRouter = (router: NextRouter) => (tagToRemove: string) => {
  const { query } = router
  const { tag: optionalTagsFromQuery } = query
  const optionalTags = convertQueryParamToArray(optionalTagsFromQuery)

  const newTagsParameter = produce(optionalTags, (draft) => {
    const indexOfTagToRemove = draft.indexOf(tagToRemove)
    if (indexOfTagToRemove !== -1) {
      draft.splice(indexOfTagToRemove, 1)
    }
  })

  let newQueryParams = {}
  if (newTagsParameter.length !== 0) {
    newQueryParams = updateRoutingQuery(query, { tag: convertArrayToQueryParam(newTagsParameter) })
  } else {
    newQueryParams = removeRoutingQueryParams(query, ['tag'])
  }
  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  router.replace(
    {
      pathname: `/m/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )
}


const SearchTags: FC = (_props) => {
  const router = useRouter()
  const {
    query: {
      tag: tagQueryParam,
    },
  } = router

  const {t} = useTranslation('map');
  
  const tagsFromURL: string[] = convertQueryParamToArray(tagQueryParam)


  // the ant select uses useLayout internally and we need to be sure it's mounted on the browser
  const [showSelect, setShowSelect] = useState<boolean>(false)
  useEffect(() => {
    setShowSelect(true)
  }, [])

  const [selectedTags, setSelectedTags] = useState<string[]>([''])
  const selectedTagsRef = useRef<string[]>([''])
  useEffect(() => {
    if (!lodashIsEqual(selectedTagsRef.current, tagsFromURL)) {
      selectedTagsRef.current = tagsFromURL
      setSelectedTags(tagsFromURL)
    }
  }, [tagsFromURL])


  return (
      <Fragment>
          {showSelect && (
              <div
                  style={{
                      marginTop: 8,
                  }}
              >
                  <TagsSelect
                      placeholder={
                          t('searchForTagsPlaceholder') || 'Search for tags'
                      }
                      value={selectedTags}
                      onSelect={addTagToRouter(router)}
                      onDeselect={removeTagFromRouter(router)}
                      onClear={removeAllTagsFromRouter(router)}
                  />
              </div>
          )}
      </Fragment>
  );
}

SearchTags.defaultProps = {
  optionsCount: [],
}

export default SearchTags

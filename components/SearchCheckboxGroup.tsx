import { FC } from 'react'
import TagsCheckboxGroup from './TagsCheckboxGroup'
import { NextRouter, useRouter } from 'next/router'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import {
  convertArrayToQueryParam,
  convertQueryParamToArray,
  removeRoutingQueryParams,
  updateRoutingQuery,
} from '../utils/utils'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'


const addOrRemoveTagsFromQuery = (router: NextRouter) => (event: CheckboxChangeEvent) => {
  const { query } = router
  const { tag } = query

  const {
    target: {
      checked: isCheckboxChecked,
      value: tagsFromCheckbox,
    },
  } = event

  //
  const oldQueryTags: string[] = convertQueryParamToArray(tag)

  let newQueryTags: string[] = []
  if (isCheckboxChecked) {
    newQueryTags = [...oldQueryTags]
    tagsFromCheckbox.forEach((tag) => {
      if (!oldQueryTags.includes(tag)) {
        newQueryTags.push(tag)
      }
    })
  } else {
    newQueryTags = oldQueryTags.filter((tag) => !tagsFromCheckbox.includes(tag))
  }

  const newTags = convertArrayToQueryParam(newQueryTags)
  let newQueryParams = updateRoutingQuery(query, { tag: newTags })
  if (newQueryTags.length === 0) {
    newQueryParams = removeRoutingQueryParams(newQueryParams, ['tag'])
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

const SearchCheckboxGroup: FC = () => {
  const router = useRouter()
  const { query } = router
  const { tag } = query
  const selectedTags = convertQueryParamToArray(tag)

  return (
    <TagsCheckboxGroup
      onChange={addOrRemoveTagsFromQuery(router)}
      selectedValues={selectedTags}
    />
  )
}

export default SearchCheckboxGroup

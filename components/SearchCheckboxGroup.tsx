import { FC } from 'react'
import TagsCheckboxGroup from './TagsCheckboxGroup'
import { NextRouter, useRouter } from 'next/router'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import {
  convertQueryParamToArray,
  convertQueryParamToString,
  updateRoutingQuery,
} from '../utils/utils'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'


const addOrRemoveTagsFromQuery = (router: NextRouter) => (event: CheckboxChangeEvent) => {
  const { query } = router
  const { search: searchParam } = query
  const search = convertQueryParamToString(searchParam)

  const {
    target: {
      checked: isCheckboxChecked,
      value,
    },
  } = event

  const tagsFromCheckbox: string[] = value

  const searchTokens = search.split(' ')

  let newSearchParam: string = ''
  if (isCheckboxChecked) {
    newSearchParam = search
    tagsFromCheckbox.forEach((tag) => {
      if (!searchTokens.includes(tag)) {
        newSearchParam = `${newSearchParam} ${tag}`
      }
    })
  }
  else {
    searchTokens.forEach((token) => {
      if (!tagsFromCheckbox.includes(token)) {
        newSearchParam = `${newSearchParam} ${token}`
      }
    })
  }

  newSearchParam = newSearchParam.trim()

  let newQueryParams = updateRoutingQuery(query, { search: newSearchParam })

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
  const { search: searchParam } = query
  const search = convertQueryParamToString(searchParam)
  const searchTokens = search.split( ' ')


  return (
    <TagsCheckboxGroup
      onChange={addOrRemoveTagsFromQuery(router)}
      selectedValues={searchTokens}
    />
  )
}

export default SearchCheckboxGroup

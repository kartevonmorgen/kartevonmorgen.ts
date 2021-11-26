import { FC } from 'react'
import TagsCheckboxGroup from './TagsCheckboxGroup'
import { NextRouter, useRouter } from 'next/router'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { convertArrayToQueryParam, convertQueryParamToArray, updateRoutingQuery } from '../utils/utils'
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
    tagsFromCheckbox.forEach(tag => {
      if (!oldQueryTags.includes(tag)) {
        newQueryTags.push(tag)
      }
    })
  } else {
    newQueryTags = oldQueryTags.filter(tag => !tagsFromCheckbox.includes(tag))
  }

  const newQueryParams = updateRoutingQuery(query, { tag: convertArrayToQueryParam(newQueryTags) })
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

  return (
    <TagsCheckboxGroup
      onChange={addOrRemoveTagsFromQuery(router)}
    />
  )
}

export default SearchCheckboxGroup
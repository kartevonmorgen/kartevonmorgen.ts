import { FC } from 'react'
import { Tag } from 'antd'
import { CategoryToNameMapper, knownCategories } from '../dtos/Categories'
import { NextRouter, useRouter } from 'next/router'
import { convertArrayToQueryParam, removeRoutingQueryParams, updateRoutingQuery } from '../utils/utils'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'
import { getTypeNamesFromRouterOrKnownCategoryNamesIfEmpty } from '../utils/router'

const { CheckableTag } = Tag


const handleChange = (
  typeName: string,
  checked: boolean,
  selectedTypes: string[],
  router: NextRouter,
) => {
  const { query } = router

  let nextSelectedTypes = [] as string[]
  if (selectedTypes.length === knownCategories.length) {
    // if all are selected -> disable others
    nextSelectedTypes = [typeName]
  } else if (selectedTypes.length === 1 && selectedTypes[0] === typeName) {
    // if this type is the only active type -> select all types to prevent non-selection
    nextSelectedTypes = Object.values(knownCategories)
  } else {
    // everything is normal
    if (checked) {
      nextSelectedTypes = [...selectedTypes, typeName]
    } else {
      nextSelectedTypes = selectedTypes.filter((tName) => tName !== typeName)
    }
  }

  let newQueryParams = {}
  if (nextSelectedTypes.length < knownCategories.length) {
    newQueryParams = updateRoutingQuery(query, { type: convertArrayToQueryParam(nextSelectedTypes) })
  } else {
    // all tags are selected
    newQueryParams = removeRoutingQueryParams(query, ['type'])
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


const TypeChooser: FC = () => {
  const router = useRouter()
  const selectedTypes = getTypeNamesFromRouterOrKnownCategoryNamesIfEmpty(router)

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-evenly',
      }}
    >
      {knownCategories.map((category) => {
        const categoryName = CategoryToNameMapper[category]
        const isChecked = selectedTypes.indexOf(categoryName) > -1

        return (
          <CheckableTag
            className={isChecked && `${categoryName}-checkable-tag`}
            checked={isChecked}
            onChange={(checked) => handleChange(categoryName, checked, selectedTypes, router)}
            style={{
              width: '30%',
              textAlign: 'center',
              margin: 0,
            }}
          >
            {categoryName}
          </CheckableTag>
        )
      })}
    </div>
  )
}


export default TypeChooser

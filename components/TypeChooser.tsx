import { FC } from 'react'
import { Col, Row, Tag } from 'antd'
import lodashClone from 'lodash/clone'
import Category, { CategoryToNameMapper, knownCategories } from '../dtos/Categories'
import { NextRouter, useRouter } from 'next/router'
import { convertArrayToQueryParam, convertQueryParamToArray, updateRoutingQuery } from '../utils/utils'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'

const { CheckableTag } = Tag


const handleChange = (
  typeId: Category,
  checked: boolean,
  selectedTypes: Category[],
  router: NextRouter,
) => {

  const { query } = router

  let nextSelectedTypes = [] as Category[]
  if (selectedTypes.length === knownCategories.length) {
    // if all are selected -> disable others
    nextSelectedTypes = [typeId]
  } else if (selectedTypes.length === 1 && selectedTypes[0] === typeId) {
    // if this type is the only active type -> select all types to prevent non-selection
    nextSelectedTypes = lodashClone(knownCategories)
  } else {
    // everything is normal
    if (checked) {
      nextSelectedTypes = [...selectedTypes, typeId]
    } else {
      nextSelectedTypes = selectedTypes.filter(tId => tId !== typeId)
    }
  }

  const newQueryParams = updateRoutingQuery(query, { type: convertArrayToQueryParam(nextSelectedTypes) })
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
  const { query } = router
  const { type: typesParam } = query
  let selectedTypes = convertQueryParamToArray(typesParam) as Category[]

  return (
    <Row gutter={8}>
      {knownCategories.map(category => {
        const categoryName = CategoryToNameMapper[category]
        const isChecked = selectedTypes.indexOf(category) > -1

        return (
          <Col key={category} span={8}>
            <CheckableTag
              className={isChecked && `${categoryName}-tag`}
              checked={isChecked}
              onChange={checked => handleChange(category, checked, selectedTypes, router)}
              style={{
                width: '100%',
                textAlign: 'center',
              }}
            >
              {categoryName}
            </CheckableTag>
          </Col>
        )
      })}
    </Row>
  )
}


export default TypeChooser

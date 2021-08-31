import { FC } from 'react'

import { Col, Row, Tag } from 'antd'
import Category from '../dtos/Categories'
import { NextRouter, useRouter } from 'next/router'
import { convertQueryParamToArray, updateRoutingQuery } from '../utils/utils'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'

const { CheckableTag } = Tag

export interface Type {
  id: Category
  name: string
}


// todo: move the colors an style file because of different themes
export const types: Type[] = [
  {
    id: Category.INITIATIVE,
    name: 'initiative',
  },
  {
    id: Category.COMPANY,
    name: 'company',
  },
  {
    id: Category.EVENT,
    name: 'event',
  },
]


const handleChange = (
  typeId: Category,
  checked: boolean,
  selectedTypes: Category[],
  router: NextRouter,
) => {

  const { query } = router

  let nextSelectedTypes = [] as Category[]
  if (selectedTypes.length === types.length) {
    // if all are selected -> disable others
    nextSelectedTypes = [typeId]
  } else if (selectedTypes.length === 1 && selectedTypes[0] === typeId) {
    // if this type is the only active type -> select all types to prevent non-selection
    nextSelectedTypes = types.map(type => type.id)
  } else {
    // everything is normal
    if (checked) {
      nextSelectedTypes = [...selectedTypes, typeId]
    } else {
      nextSelectedTypes = selectedTypes.filter(tId => tId !== typeId)
    }
  }

  const newQueryParams = updateRoutingQuery(query, { type: nextSelectedTypes })
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
      {types.map(type => {
        const isChecked = selectedTypes.indexOf(type.id) > -1
        return (
          <Col key={type.id} span={8}>
            <CheckableTag
              className={isChecked && `${type.name}-tag`}
              checked={isChecked}
              onChange={checked => handleChange(type.id, checked, selectedTypes, router)}
              style={{
                width: '100%',
                textAlign: 'center',
              }}
            >
              {type.name}
            </CheckableTag>
          </Col>
        )
      })}
    </Row>
  )
}


export default TypeChooser

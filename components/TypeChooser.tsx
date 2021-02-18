import { FC } from 'react'

import { Tag } from 'antd'
import Category from '../dtos/Categories'

import { green, lime, magenta } from '@ant-design/colors'
import { NextRouter, useRouter } from 'next/router'
import { convertQueryParamToArray, updateRoutingQuery } from '../utils/utils'

const { CheckableTag } = Tag

interface Type {
  id: Category
  name: string
  color: string
}


// todo: move the colors an style file because of different themes
export const types: Type[] = [
  {
    id: Category.INITIATIVE,
    name: 'Initiative',
    color: lime.primary,
  },
  {
    id: Category.COMPANY,
    name: 'Company',
    color: green.primary,
  },
  {
    id: Category.EVENT,
    name: 'Event',
    color: magenta.primary,
  },
]


const handleChange = (
  typeId: Category,
  checked: boolean,
  selectedTypes: Category[],
  router: NextRouter,
) => {

  const {query} = router

  let nextSelectedTypes = [] as Category[]
  if (selectedTypes.length === types.length) {
    // if all are selected -> disable others
    nextSelectedTypes = [typeId]
  } else if(selectedTypes.length === 1 && selectedTypes[0] === typeId) {
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

  const newQueryParams = updateRoutingQuery(query, {type: nextSelectedTypes})

  router.replace(
    {
      pathname: '/maps/[project]',
      query: newQueryParams,
    },
    undefined,
    { shallow: true }
  )
}


const TypeChooser: FC = () => {
  const router = useRouter()
  const { query } = router
  const { type: typesParam } = query
  let selectedTypes = convertQueryParamToArray(typesParam) as Category[]

  return (
    <>
      {types.map(type => {
        const isChecked = selectedTypes.indexOf(type.id) > -1
        return (
          <CheckableTag
            key={type.id}
            checked={isChecked}
            onChange={checked => handleChange(type.id, checked, selectedTypes, router)}
            style={{
              backgroundColor: isChecked && type.color,
            }}
          >
            {type.name}
          </CheckableTag>
        )
      })}
    </>
  )
}


export default TypeChooser

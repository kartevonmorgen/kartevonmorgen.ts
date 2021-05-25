import React, { Dispatch, FC, useEffect, useState } from 'react'
import Category from '../dtos/Categories'
import EntityFormHeader from './EntryFormHeader'
import { Select } from 'antd'
import { SlugVerb } from '../utils/types'
import EntityForm from './EntityForm'


const changeCategory = (setCategory: Dispatch<Category>) => (category: Category) => {
  setCategory(category)
}


interface EntityChooserFormProps {
  category?: Category
  action: SlugVerb.CREATE | SlugVerb.EDIT
}

const EntityChooserForm: FC<EntityChooserFormProps> = (props) => {

  const [category, setCategory] = useState<Category>(null)

  useEffect(() => {
    setCategory(props.category)
  }, [props.category])

  return (
    <div style={{ paddingBottom: 60 }}>
      <EntityFormHeader
        isEdit={props.action === SlugVerb.EDIT}
      />

      {
        props.action === SlugVerb.CREATE && (
          <Select
            placeholder="Category"
            onSelect={changeCategory(setCategory)}
            style={{
              width: '100%',
              marginTop: 8,
              marginBottom: 16,
            }}
            value={category}
          >
            <Select.Option value={Category.INITIATIVE}>Initiative</Select.Option>
            <Select.Option value={Category.COMPANY}>Company</Select.Option>
            <Select.Option value={Category.EVENT}>Event</Select.Option>
          </Select>
        )
      }

      <EntityForm category={category}/>

    </div>
  )
}

export default EntityChooserForm
import React, { Dispatch, FC, useEffect, useState } from 'react'
import Category from '../dtos/Categories'
import EntryForm from './EntryForm'
import EntityFormHeader from './EntryFormHeader'
import { Select } from 'antd'
import EventForm from './EventForm'
import { SlugVerb } from '../utils/types'


const renderForm = (category: Category) => {
  switch (category) {
    case Category.INITIATIVE:
      return (
        <EntryForm/>
      )
    case Category.COMPANY:
      return (
        <EntryForm/>
      )
    case Category.EVENT:
      return <EventForm/>
    default:
      return null
  }
}

const changeCategory = (setCategory: Dispatch<Category>) => (category: Category) => {
  setCategory(category)
}

const calculateLevelsToBack = (action: SlugVerb.EDIT | SlugVerb.CREATE): number => {
  switch (action) {
    case SlugVerb.CREATE:
      return 2
    case SlugVerb.EDIT:
      return 1
    default:
      return 2
  }
}

interface EntityFormProps {
  category?: Category
  action: SlugVerb.CREATE | SlugVerb.EDIT
}

const EntityForm: FC<EntityFormProps> = (props) => {

  const [category, setCategory] = useState<Category>(null)

  useEffect(() => {
    setCategory(props.category)
  }, [props.category])

  return (
    <div style={{ paddingBottom: 60 }}>
      <EntityFormHeader
        backLevel={calculateLevelsToBack(props.action)}
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

      {
        renderForm(category)
      }

    </div>
  )
}

export default EntityForm
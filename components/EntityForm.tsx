import React, { Dispatch, FC, useState } from 'react'
import Category from '../dtos/Categories'
import EntryForm from './EntryForm'
import EntityFormHeader from './EntryFormHeader'
import { Select } from 'antd'
import EventForm from './EventForm'


const renderForm = (category: Category) => {
  switch (category) {
    case Category.INITIATIVE:
      return (
        <EntryForm
          category={category}
        />
      )
    case Category.COMPANY:
      return (
        <EntryForm
          category={category}
        />
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

const EntityForm: FC = () => {

  const [category, setCategory] = useState<Category>(null)

  return (
    <div style={{ paddingBottom: 60 }}>
      <EntityFormHeader/>

      <Select
        placeholder="Category"
        onSelect={changeCategory(setCategory)}
        style={{
          width: '100%',
          marginTop: 8,
          marginBottom: 16,
        }}
      >
        <Select.Option value={Category.INITIATIVE}>Initiative</Select.Option>
        <Select.Option value={Category.COMPANY}>Company</Select.Option>
        <Select.Option value={Category.EVENT}>Event</Select.Option>
      </Select>

      {
        renderForm(category)
      }

    </div>
  )
}

export default EntityForm
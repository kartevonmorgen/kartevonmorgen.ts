import React, { FC } from 'react'
import Category from '../dtos/Categories'
import EntryForm from './EntryForm'
import EventForm from './EventForm'


interface EntityFormProps {
  category: Category
}

const EntityForm: FC<EntityFormProps> = (props) => {
  const { category } = props

  switch (category) {
    case Category.INITIATIVE:
      return (
        <EntryForm category={Category.INITIATIVE}/>
      )
    case Category.COMPANY:
      return (
        <EntryForm category={Category.COMPANY}/>
      )
    case Category.EVENT:
      return <EventForm category={Category.EVENT}/>
    default:
      return null
  }
}


export default EntityForm
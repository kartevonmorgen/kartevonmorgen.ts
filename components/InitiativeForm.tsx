import React, { FC } from 'react'
import EntryForm from './EntryForm'
import Category from '../dtos/Categories'
import { SearchEntryID } from '../dtos/SearchEntry'
import { SlugVerb } from '../utils/types'


interface InitiativeFormProps {
  initiativeId: SearchEntryID
  verb: SlugVerb.EDIT | SlugVerb.CREATE
}


const InitiativeForm: FC<InitiativeFormProps> = (props) => {
  const { verb, initiativeId } = props

  return (
    <EntryForm
      category={Category.INITIATIVE}
      verb={verb}
      entryId={initiativeId}
    />
  )
}


export default InitiativeForm

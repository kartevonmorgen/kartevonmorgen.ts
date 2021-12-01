import React, { FC } from 'react'
import Category from '../dtos/Categories'
import EventForm from './EventForm'
import InitiativeForm from './InitiativeForm'
import { SearchEntryID } from '../dtos/SearchEntry'
import { EventID } from '../dtos/Event'
import { SlugVerb } from '../utils/types'
import CompanyForm from './CompanyForm'


interface EntityFormProps {
  category: Category
  entityId?: SearchEntryID | EventID
  verb: SlugVerb.EDIT | SlugVerb.CREATE
}

const EntityForm: FC<EntityFormProps> = (props) => {
  const { category, entityId, verb } = props

  switch (category) {
    case Category.INITIATIVE:
      return (
        <InitiativeForm
          initiativeId={entityId}
          verb={verb}
        />
      )
    case Category.COMPANY:
      return (
        <CompanyForm
          companyId={entityId}
          verb={verb}
        />
      )
    case Category.EVENT:
      return (
        <EventForm
          eventId={entityId}
          verb={verb}
        />
      )
    default:
      return null
  }
}


export default EntityForm

import { Dispatch, FC, MutableRefObject, SetStateAction } from 'react'
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
  setCategory: Dispatch<SetStateAction<Category>>
  isFormInitialized: MutableRefObject<boolean>
}

const EntityForm: FC<EntityFormProps> = (props) => {
  const { category, setCategory, entityId, verb, isFormInitialized } = props

  switch (category) {
    case Category.INITIATIVE:
      return (
        <InitiativeForm
          initiativeId={entityId as string}
          isFormInitialized={isFormInitialized}
          verb={verb}
          setCategory={setCategory}
        />
      )
    case Category.COMPANY:
      return (
        <CompanyForm
          companyId={entityId}
          verb={verb}
          setCategory={setCategory}
          isFormInitialized={isFormInitialized}
        />
      )
    case Category.EVENT:
      return (
        <EventForm
          eventId={entityId as string}
          verb={verb}
        />
      )
    default:
      return null
  }
}


export default EntityForm

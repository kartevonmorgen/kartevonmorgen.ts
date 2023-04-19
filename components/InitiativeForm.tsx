import { Dispatch, FC, SetStateAction, Ref, MutableRefObject } from 'react'
import EntryForm from './EntryForm'
import Category from '../dtos/Categories'
import { SearchEntryID } from '../dtos/SearchEntry'
import { SlugVerb } from '../utils/types'


interface InitiativeFormProps {
  initiativeId: SearchEntryID
  verb: SlugVerb.EDIT | SlugVerb.CREATE
  setCategory: Dispatch<SetStateAction<Category>>
  isFormInitialized: MutableRefObject<boolean>
}


const InitiativeForm: FC<InitiativeFormProps> = (props) => {
  const { verb, initiativeId, setCategory, isFormInitialized } = props

  return (
    <EntryForm
      category={Category.INITIATIVE}
      verb={verb}
      entryId={initiativeId}
      setCategory={setCategory}
      isFormInitialized={isFormInitialized}
    />
  )
}


export default InitiativeForm

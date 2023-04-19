import { Dispatch, FC, MutableRefObject, SetStateAction } from 'react'
import EntryForm from './EntryForm'
import Category from '../dtos/Categories'
import { SearchEntryID } from '../dtos/SearchEntry'
import { SlugVerb } from '../utils/types'


interface CompanyFormProps {
  companyId?: SearchEntryID
  verb: SlugVerb.EDIT | SlugVerb.CREATE
  setCategory: Dispatch<SetStateAction<Category>>
  isFormInitialized: MutableRefObject<boolean>
}


const CompanyForm: FC<CompanyFormProps> = (props) => {
  const { verb, companyId, setCategory, isFormInitialized } = props

  return (
    <EntryForm
      category={Category.COMPANY}
      verb={verb}
      entryId={companyId}
      setCategory={setCategory}
      isFormInitialized={isFormInitialized}
    />
  )
}


export default CompanyForm

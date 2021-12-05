import React, { FC } from 'react'
import EntryForm from './EntryForm'
import Category from '../dtos/Categories'
import { SearchEntryID } from '../dtos/SearchEntry'
import { SlugVerb } from '../utils/types'


interface CompanyFormProps {
  companyId?: SearchEntryID
  verb: SlugVerb.EDIT | SlugVerb.CREATE
}


const CompanyForm: FC<CompanyFormProps> = (props) => {
  const { verb, companyId } = props

  return (
    <EntryForm
      category={Category.COMPANY}
      verb={verb}
      entryId={companyId}
    />
  )
}


export default CompanyForm

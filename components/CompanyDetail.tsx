import { FC } from 'react'
import { SearchEntryID } from '../dtos/SearchEntry'
import EntryDetail from './EntryDetail'


interface CompanyDetailProps {
  companyId: SearchEntryID
}


const CompanyDetail: FC<CompanyDetailProps> = (props) => {
  const {companyId} = props

  return <EntryDetail entryId={companyId} />
}


export default CompanyDetail

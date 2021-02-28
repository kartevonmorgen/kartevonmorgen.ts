import { FC } from 'react'
import { useRouter } from 'next/router'
import isString from 'lodash/isString'
import useRequest from '../api/useRequest'
import { EntryRequest } from '../dtos/EntryRequest'
import { RouterQueryParam } from '../utils/types'
import { SearchEntryID } from '../dtos/SearchEntry'
import { Entries as EntriesDTO } from '../dtos/Entry'
import API_ENDPOINTS from '../api/endpoints'


interface EntryDetailProps {
  entryId: SearchEntryID
}

const EntryDetail: FC<EntryDetailProps> = (props) => {
  const { entryId } = props

  const router = useRouter()
  const { query } = router

  const optionalOrgTag: RouterQueryParam = query['org-tag']
  const orgTag = optionalOrgTag && isString(optionalOrgTag) ? optionalOrgTag : null
  const entryRequest: EntryRequest = {
    org_tag: orgTag,
  }

  const { data, error } = useRequest<EntriesDTO>({
    url: `${API_ENDPOINTS.getEntries()}/${entryId}`,
    params: entryRequest,
  })

  return <p>entryId</p>
}

export default EntryDetail
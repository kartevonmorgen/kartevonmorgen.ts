import { FC } from 'react'
import { useRouter } from 'next/router'
import isString from 'lodash/isString'
import isArray from 'lodash/isArray'
import { Space } from 'antd'
import useRequest from '../api/useRequest'
import { EntryRequest } from '../dtos/EntryRequest'
import { RouterQueryParam } from '../utils/types'
import { SearchEntryID } from '../dtos/SearchEntry'
import { Entries as EntriesDTO } from '../dtos/Entry'
import API_ENDPOINTS from '../api/endpoints'
import EntityImage from './EntityImage'


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

  const { data: entries, error } = useRequest<EntriesDTO>({
    url: `${API_ENDPOINTS.getEntries()}/${entryId}`,
    params: entryRequest,
  })

  if (error) {
    //  todo: show error notification, redirect to the search result view
    return null
  }

  // still loading
  if (!entries) {
    return null
  }

  if (isArray(entries) && entries.length === 0) {
    //  todo: show not found notification, redirect to the search view
    return null
  }

  const entry = entries[0]

  return (
    <Space
      direction="vertical"
    >
      <EntityImage
        title={entry.title}
        src={entry.image_url}
      />
    </Space>
  )
}

export default EntryDetail
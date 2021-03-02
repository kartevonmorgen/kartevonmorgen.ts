import React, { FC } from 'react'
import { useRouter } from 'next/router'
import isString from 'lodash/isString'
import isArray from 'lodash/isArray'
import { Divider, Tag, Typography } from 'antd'
import useRequest from '../api/useRequest'
import { EntryRequest } from '../dtos/EntryRequest'
import { RouterQueryParam } from '../utils/types'
import { SearchEntryID } from '../dtos/SearchEntry'
import { Entries as EntriesDTO } from '../dtos/Entry'
import API_ENDPOINTS from '../api/endpoints'
import EntityImage from './EntityImage'
import { types as resultTypes } from './TypeChooser'
import EntryContact from './EntryContact'
import EntryAddress from './EntryAddress'
import EntryTags from './EntryTags'

const { Title, Paragraph } = Typography


interface EntryDetailProps {
  entryId: SearchEntryID
}

const EntryDetail: FC<EntryDetailProps> = (props) => {
  const { entryId } = props

  // todo: truncate long details
  // const [truncateDetail, setTruncateDetail] = useState(true)

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
  const type = resultTypes.find(t => t.id === entry.categories[0])

  return (
    <div>

      <EntityImage
        title={entry.title}
        src={entry.image_url}
      />

      <Title level={2}>{entry.title}</Title>

      <Tag color={type.color} style={{ marginBottom: 12 }}>{type.name}</Tag>

      <Paragraph>{entry.description}</Paragraph>

      <Divider orientation="left">Contact</Divider>

      <EntryContact
        homepage={entry.homepage}
        contact_name={entry.contact_name}
        email={entry.email}
        telephone={entry.telephone}

      />

      <EntryAddress
        city={entry.city}
        country={entry.country}
        state={entry.state}
        street={entry.street}
        zip={entry.zip}
      />

      <Divider orientation="left">Tags</Divider>

      <EntryTags tags={entry.tags}/>

    </div>
  )
}

export default EntryDetail
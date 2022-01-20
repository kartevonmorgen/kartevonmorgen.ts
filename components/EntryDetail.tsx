import { FC } from 'react'
import { useRouter } from 'next/router'
import isString from 'lodash/isString'
import isArray from 'lodash/isArray'
import { Divider, Spin, Typography } from 'antd'
import useRequest from '../api/useRequest'
import { EntryRequest } from '../dtos/EntryRequest'
import { RootSlugEntity, RouterQueryParam } from '../utils/types'
import { SearchEntryID } from '../dtos/SearchEntry'
import { Entries as EntriesDTO, Entry } from '../dtos/Entry'
import API_ENDPOINTS from '../api/endpoints'
import EntityContact from './EntityContact'
import EntityAddress from './EntityAddress'
import EntityTags from './EntityTags'
import EntityRatings from './EntityRatings'
import EntityFooter from './EntityFooter'
import EntityDetailHeader from './EntityDetailHeader'
import OpeningHours from './OpeningHours'
import EntryLinks from './EntryLinks'
import TypeTag from './TypeTag'
import EntryRatingFlower from './EntryRatingFlower'
import Category, { CategoryToNameMapper } from '../dtos/Categories'
import EntityImageWithLink from './EntityImageWithLink'
import EntityDescription from './EntityDescription'
import { PartialLatLng } from '../utils/geolocation'
import useFly from '../hooks/useFly'
import EntityRouteLink from './EntityRouteLink'


const { Title } = Typography


interface EntryDetailProps {
  entryId: SearchEntryID
}


const EntryDetail: FC<EntryDetailProps> = (props) => {
  const { entryId } = props

  // todo: truncate long details
  // const [truncateDetail, setTruncateDetail] = useState(true)

  // todo: duplicate code also for editing an entry, make it a higher order hook
  const router = useRouter()
  const { query, pathname } = router

  const optionalOrgTag: RouterQueryParam = query['org-tag']
  const orgTag = optionalOrgTag && isString(optionalOrgTag) ? optionalOrgTag : null
  const entryRequest: EntryRequest = {
    org_tag: orgTag,
  }

  const { data: entries, error: entriesError } = useRequest<EntriesDTO>({
    url: `${API_ENDPOINTS.getEntries()}/${entryId}`,
    params: entryRequest,
  })

  const foundEntry: boolean = isArray(entries) && entries.length !== 0
  const entry: Entry = foundEntry ? entries[0] : null
  const partialEntryLatLng: PartialLatLng = {
    lat: entry?.lat,
    lng: entry?.lng,
  }

  useFly(partialEntryLatLng)

  if (entriesError) {
    //  todo: show error notification, redirect to the search result view
    return null
  }

  // still loading
  if (!entries) {
    return (
      <div className='center'>
        <Spin size="large"/>
      </div>
    )
  }

  if (!foundEntry) {
    //  todo: show not found notification, redirect to the search view
    return null
  }


  const type: Category = entry.categories[0]
  const typeName: string = CategoryToNameMapper[type]

  return (
    <div id="entity-detail">
      <EntityDetailHeader/>

      <EntityImageWithLink
        title={entry.title}
        src={entry.image_url}
        link={entry.image_link_url}
      />

      <Title level={2}>{entry.title}</Title>

      <TypeTag
        type={typeName}
        style={{ marginBottom: 12 }}
      />

      <EntityDescription
        text={entry.description}
      />

      <Divider/>

      <EntityContact
        homepage={entry.homepage}
        contact_name={entry.contact_name}
        email={entry.email}
        telephone={entry.telephone}
      />

      <EntityAddress
        city={entry.city}
        country={entry.country}
        state={entry.state}
        street={entry.street}
        zip={entry.zip}
      />

      <EntityRouteLink
        latLng={{
          lat: entry.lat,
          lng: entry.lng,
        }}
        address={{
          city: entry.city,
          country: entry.country,
          state: entry.state,
          street: entry.street,
          zip: entry.zip,
        }}
      />

      <OpeningHours openingHours={entry.opening_hours}/>

      <EntryLinks links={entry.custom}/>

      <EntityTags tags={entry.tags}/>

      <EntryRatingFlower
        entryId={entryId}
      />

      <EntityRatings ratingsIds={entry.ratings}/>

      <EntityFooter
        entityId={entry.id}
        type={RootSlugEntity.ENTRY}
        title={entry.title}
        activeLink={pathname}
        created_at={entry.created}
        version={entry.version}
      />

    </div>
  )
}

export default EntryDetail

import { FC } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import { Divider, Spin, Tag, Typography } from 'antd'
import Event, { EventID } from '../dtos/Event'
import EntityFooter from './EntityFooter'
import EntityDetailHeader from './EntityDetailHeader'
import EntityContact from './EntityContact'
import EntityAddress from './EntityAddress'
import EntityTags from './EntityTags'
import API_ENDPOINTS from '../api/endpoints'
import useRequest from '../api/useRequest'
import { RootSlugEntity } from '../utils/types'
import EntityImageWithLink from './EntityImageWithLink'
import EntityDescription from './EntityDescription'
import { formatDuration } from '../utils/time'
import { PartialLatLng } from '../utils/geolocation'
import useFly from '../hooks/useFly'
import EntityRouteLink from './EntityRouteLink'

const { Title, Text } = Typography


interface EventDetailProps {
  eventId: EventID
}


const EventDetail: FC<EventDetailProps> = (props) => {
  const { eventId } = props

  const router = useRouter()
  const { pathname } = router


  const { data: event, error: eventError } = useRequest<Event>({
    url: `${API_ENDPOINTS.getEvent()}/${eventId}`,
  })

  const partialEventLatLng: PartialLatLng = {
    lat: event?.lat,
    lng: event?.lng,
  }

  useFly(partialEventLatLng)

  if (eventError) {
    //  todo: show error notification, redirect to the search result view
    return null
  }

  // still loading
  if (!event) {
    return (
      <div className='center'>
        <Spin size="large"/>
      </div>
    )
  }


  return (
    <div id="entity-detail">

      <EntityDetailHeader/>

      <EntityImageWithLink
        title={event.title}
        src={event.image_url}
        link={event.image_link_url}
      />

      <Title
        level={2}
        style={{
          marginBottom: 0,
        }}
      >
        {event.title}
      </Title>

      {/* todo: allow newline*/}
      <Text
        type="secondary"
      >
        {
          formatDuration({
            start: moment.unix(event.start),
            end: moment.unix(event.end),
          })
        }
      </Text>

      <Tag color={RootSlugEntity.EVENT} style={{ marginBottom: 12 }}>{RootSlugEntity.EVENT}</Tag>

      <EntityDescription
        text={event.description}
      />

      <Divider/>

      <EntityContact
        homepage={event.homepage}
        contact_name={event.organizer}
        email={event.email}
        telephone={event.telephone}
      />

      <EntityAddress
        city={event.city}
        country={event.country}
        state={event.state}
        street={event.street}
        zip={event.zip}
      />

      <EntityRouteLink
        latLng={{
          lat: event.lat,
          lng: event.lng,
        }}
        address={{
          city: event.city,
          country: event.country,
          state: event.state,
          street: event.street,
          zip: event.zip,
        }}
      />

      <EntityTags tags={event.tags}/>

      <EntityFooter
        entityId={event.id}
        type={RootSlugEntity.EVENT}
        title={event.title}
        activeLink={pathname}
        created_at={event.created_at}
      />


    </div>
  )
}

export default EventDetail

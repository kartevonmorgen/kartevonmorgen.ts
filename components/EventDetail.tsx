import React, { FC, useEffect } from 'react'
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
import { isValidLatLng, LatLng, PartialLatLng } from '../utils/geolocation'
import { setCenterAndZoom } from '../utils/map'
import { DEFAULTS } from '../consts/map'

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

  useEffect(() => {

    if (!isValidLatLng(partialEventLatLng)) {
      return
    }

    setCenterAndZoom(router, partialEventLatLng as LatLng, DEFAULTS.close_zoom)

  }, [partialEventLatLng.lat, partialEventLatLng.lng])

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
    <div>

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

      {/*todo: allow newline*/}
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
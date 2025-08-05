import { FC } from 'react'
import {useDispatch} from 'react-redux'
import { useRouter } from 'next/router'
import Head from 'next/head'
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
import { useMount, useUnmount } from 'ahooks'
import { entityDetailActions, viewActions } from '../slices'

const { Title, Text } = Typography


interface EventDetailProps {
  eventId: EventID
}


const EventDetail: FC<EventDetailProps> = (props) => {
  const { eventId } = props

  const router = useRouter()
  const { pathname } = router

  const dispatch = useDispatch()

  const { data: event, error: eventError } = useRequest<Event>({
    url: `${API_ENDPOINTS.getEvent()}/${eventId}`,
  })

  const partialEventLatLng: PartialLatLng = {
    lat: event?.lat,
    lng: event?.lng,
  }

  useFly(partialEventLatLng)

  useMount(() => {
    dispatch(viewActions.setHighlight(eventId))
  })

  useUnmount(() => {
    dispatch(viewActions.unsetHighlight())
  })

  useUnmount(() => {
    dispatch(entityDetailActions.setFalseShouldChangeZoomOnEntrance())
  })

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

  const currentUrl = window.location.href

  // Generate Open Graph description
  const ogDescription = event.description 
    ? event.description.length > 160 
      ? `${event.description.substring(0, 157)}...`
      : event.description
    : `Event in ${event.city}${event.country ? `, ${event.country}` : ''}`

  const eventDuration = formatDuration({
    start: moment.unix(event.start),
    end: moment.unix(event.end),
  })

  const ogTitle = `${event.title} - Event`

  return (
    <div id="entity-detail">
      <Head>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDescription} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="event" />
        
        {/* Event-specific Open Graph tags */}
        <meta property="event:start_time" content={moment.unix(event.start).toISOString()} />
        <meta property="event:end_time" content={moment.unix(event.end).toISOString()} />
        
        {/* Add image if available */}
        {event.image_url && (
          <meta property="og:image" content={event.image_url} />
        )}
        
        {/* Location-specific Open Graph tags */}
        {event.lat && event.lng && (
          <>
            <meta property="place:location:latitude" content={event.lat.toString()} />
            <meta property="place:location:longitude" content={event.lng.toString()} />
          </>
        )}
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        {event.image_url && (
          <meta name="twitter:image" content={event.image_url} />
        )}
      </Head>

      <EntityDetailHeader hasImage={event.image_url !== undefined && event.image_url !== null}/>

      <EntityImageWithLink
        title={event.title}
        src={event.image_url}
        link={event.image_link_url}
      />

      <Title
        level={3}
        style={{
          marginBottom: 0,
          marginTop: 12,
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

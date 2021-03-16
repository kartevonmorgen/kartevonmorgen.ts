import { FC } from 'react'
import { renderToString } from 'react-dom/server'
import { NextRouter, useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import produce from 'immer'
import { DivIcon } from 'leaflet'
import { MapContainer, Marker, TileLayer, ZoomControl } from 'react-leaflet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MapEventsListener from './MapEventsListener'
import MapLocationInitializer from './MapLocationInitializer'
import SearchEventsListener from './SearchEventsListener'
import { types as resultType } from './TypeChooser'
import { SearchResult, SearchResults } from '../dtos/SearchResult'
import { RootState } from '../slices'
import searchResultSelector from '../selectors/searchResults'
import Category, { Categories } from '../dtos/Categories'
import { convertQueryParamToArray } from '../utils/utils'
import { mapTypeIdToPluralEntityName, SlugEntity, SlugVerb } from '../utils/types'
import { getSlugActionFromQuery } from '../utils/slug'
import 'leaflet/dist/leaflet.css'


const icons = {
  [Category.EVENT]: null,
  [Category.COMPANY]: null,
  [Category.INITIATIVE]: null,
}

// memoize icons to prevent object creations
const getIcon = (types: Categories) => {
  const typeId = types[0]
  const icon = icons[typeId]

  if (!icon) {
    const type = resultType.find(t => t.id === typeId)
    icons[typeId] = new DivIcon({
      html: renderToString(
        <FontAwesomeIcon
          className="custom-map-marker"
          style={{
            fontSize: 50,
          }}
          icon="map-marker"/>)
      ,
      iconSize: [50, 50],
      className: 'transparent map-marker',
    })

    return icons[typeId]
  }

  return icon
}

const onClickOnPin = (router: NextRouter, searchResult: SearchResult) => () => {
  const { query } = router
  const { verb, entity: slugEntity } = getSlugActionFromQuery(query)

  // if we are in the middle of creating/editing an entity, clicking on pins should do nothing
  if (verb !== SlugVerb.SHOW) {
    return
  }

  const category = searchResult.categories[0]
  const pluralEntityName = mapTypeIdToPluralEntityName[category]

  const newQueryParams = produce(query, draftState => {
    const { slug } = draftState
    const slugArray = convertQueryParamToArray(slug)
    if (slugEntity !== SlugEntity.RESULT) {
      slugArray.splice(slugArray.length - 2, 2)
    }

    slugArray.push(pluralEntityName, searchResult.id)
    draftState.slug = slugArray
  })

  router.replace(
    {
      pathname: '/maps/[...slug]',
      query: newQueryParams,
    },
    undefined,
    { shallow: true },
  )
}


export interface MapLocationProps {
  lat: number
  lng: number
  zoom: number
}

const Map: FC = () => {
  const router = useRouter()
  const { query } = router
  const { slug } = query
  const path = convertQueryParamToArray(slug)
  const project = path[0]

  const searchResults: SearchResults = useSelector(
    (state: RootState) => searchResultSelector(state),
  )

  return (
    <MapContainer
      center={[50.826, 10.92]}
      zoom={7}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <MapLocationInitializer/>
      <MapEventsListener/>
      <SearchEventsListener/>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright"/>
      {
        searchResults.map((searchResult: SearchResult) => (
          <Marker
            key={searchResult.id}
            position={[searchResult.lat, searchResult.lng]}
            icon={getIcon(searchResult.categories)}
            eventHandlers={{
              click: onClickOnPin(router, searchResult),
            }}
          >

          </Marker>
        ))
      }
    </MapContainer>
  )
}


export default Map
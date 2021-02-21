import { FC } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { Icon } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'

import MapEventsListener from './MapEventsListener'
import MapLocationInitializer from './MapLocationInitializer'
import SearchEventsListener from './SearchEventsListener'
import { types as resultType } from './TypeChooser'
import { SearchResult, SearchResults } from '../dtos/SearchResult'
import { RootState } from '../slices'
import searchResultSelector from '../selectors/searchResults'
import Category, { Categories } from '../dtos/Categories'

import { convertQueryParamToArray } from '../utils/utils'
import 'leaflet/dist/leaflet.css'


const icons = {
  [Category.EVENT]: null,
  [Category.COMPANY]: null,
  [Category.INITIATIVE]: null,
}

// memoize icons to prevent object creations
const getIcon = (types: Categories, project: string) => {
  const typeId = types[0]
  const icon = icons[typeId]
  if (!icon) {
    const type = resultType.find(t => t.id === typeId)
    icons[typeId] = new Icon({
      iconUrl: `/projects/${project}/icons/${type.name.toLowerCase()}-plain.png`,
      iconRetinaUrl: `/projects/${project}/icons/${type.name.toLowerCase()}-plain-2x.png`,
    })

    return icons[typeId]
  }

  return icon
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
            icon={getIcon(searchResult.categories, project)}
          >
            <Popup>
              {searchResult.title}
            </Popup>
          </Marker>
        ))
      }
    </MapContainer>
  )
}


export default Map
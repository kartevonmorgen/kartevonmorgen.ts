import { FC } from 'react'
import {useSelector} from 'react-redux'
import { Icon } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'

import MapEventsListener from './MapEventsListener'
import MapLocationInitializer from './MapLocationInitializer'
import SearchEventsListener from './SearchEventsListener'

import { SearchResult, SearchResults } from '../dtos/SearchResult'
import { RootState } from '../slices'
import searchResultSelector from '../selectors/searchResults'
import Category from '../dtos/Categories'

import 'leaflet/dist/leaflet.css'



const icon = new Icon({
  iconUrl: '/projects/main/icons/initiative-plain.png',
  iconRetinaUrl: '/projects/main/icons/initiative-plain-2x.png',
})

const icons = {
  [Category.EVENT]: null
}


export interface MapLocationProps {
  lat: number
  lng: number
  zoom: number
}

const Map: FC = () => {
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
      <MapLocationInitializer />
      <MapEventsListener />
      <SearchEventsListener />
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
            icon={icon}
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
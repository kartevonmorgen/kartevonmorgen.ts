import { FC } from 'react'
import {useSelector} from 'react-redux'
import { Icon } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'

import MapEventsListener from './MapEventsListener'
import MapLocationInitializer from './MapLocationInitializer'
import SearchEventsListener from './SearchEventsListener'
import SearchEntry, { SearchEntries } from '../dtos/SearchEntry'

import 'leaflet/dist/leaflet.css'
import { RootState } from '../slices'


const icon = new Icon({
  iconUrl: '/projects/main/icons/initiative-plain.png',
  iconRetinaUrl: '/projects/main/icons/initiative-plain-2x.png',
})


export interface MapLocationProps {
  lat: number
  lng: number
  zoom: number
}

const Map: FC = () => {
  const searchEntries: SearchEntries = useSelector((state: RootState) => state.entries)

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
        searchEntries.map((searchEntry: SearchEntry) => (
          <Marker
            position={[searchEntry.lat, searchEntry.lng]}
            icon={icon}
          >
            <Popup>
              {searchEntry.title}
            </Popup>
          </Marker>
        ))
      }
    </MapContainer>
  )
}


export default Map
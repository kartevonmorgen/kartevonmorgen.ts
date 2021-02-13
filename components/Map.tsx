import { FC } from 'react'
import { Icon } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'

import MapEventsListener from './MapEventsListener'

import 'leaflet/dist/leaflet.css'
import MapLocationInitializer from './MapLocationInitializer'


const icon = new Icon({
  iconUrl: '/projects/main/icons/initiative-plain.png',
  iconRetinaUrl: '/projects/main/icons/initiative-plain-2x.png',
})


export interface MapLocationProps {
  lat: number
  lng: number
  zoom: number
}

interface MapProps extends MapLocationProps {

}

const Map: FC = () => {
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
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright"/>
      <Marker
        position={[50.826, 10.92]}
        icon={icon}
      >
        <Popup>
          A pretty CSS3 popup.
          <br/>
          Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  )
}


export default Map
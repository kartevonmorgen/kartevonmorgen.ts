import {Icon} from 'leaflet'
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'


const icon = new Icon({
  iconUrl: '/projects/kvm/icons/initiative-plain.png',
  iconRetinaUrl: '/projects/kvm/icons/initiative-plain-2x.png',
});


const Map = () => {
  return (
    <div id="map">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={true}
        style={{height: '100%', width: '100%'}}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[51.505, -0.09]}
          icon={icon}
        >
          <Popup>
            A pretty CSS3 popup.
            <br/>
            Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}


export default Map
import { FC } from 'react'
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import MapEventsListener from './MapEventsListener'
import MapLocationInitializer from './MapLocationInitializer'
import SearchEventsListener from './SearchEventsListener'
import AddEntryButton from './AddEntryButton'
import BurgerMenu from './BurgerMenu'
import MapQueryParamsListener from './MapQueryParamsListener'
import LocateMe from './LocateMe'
import MapSharingDropdown from './MapSharingDropdown'
import MapMarkers from './MapMarkers'
import NewMapMarker from './NewMapMarker'
import CollapseSidebarButton from './CollapseSidebarButton'
import 'leaflet/dist/leaflet.css'


export interface MapLocationProps {
  lat: number
  lng: number
  zoom: number
}

const Map: FC = () => {
  return (
      <MapContainer
          center={[50.826, 10.92]}
          zoom={7}
          scrollWheelZoom={true}
          style={{height: '100%', width: '100%'}}
          zoomControl={false}
      >
          <MapLocationInitializer />

          <MapEventsListener />

          <MapQueryParamsListener />

          <SearchEventsListener />

          <CollapseSidebarButton />

          <div id="map-bottom-right-above-controller">
              <LocateMe />
          </div>

          <div id="map-top-right">
              <BurgerMenu />
          </div>

          <div id="map-bottom-right-below-controller">
              <MapSharingDropdown />

              <AddEntryButton shortTitle/>
          </div>

          <ZoomControl position="bottomright" />

          <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapMarkers />

          <NewMapMarker />
      </MapContainer>
  );
}


export default Map

import { FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import produce from 'immer'
import { Icon, LatLng, latLng, Point } from 'leaflet'
import { MapContainer, Marker, TileLayer, ZoomControl } from 'react-leaflet'
import { RootState } from '../slices'
import searchResultSelector from '../selectors/searchResults'
import Category, { Categories, CategoryToNameMapper } from '../dtos/Categories'
import { SearchResult, SearchResults } from '../dtos/SearchResult'
import { convertQueryParamToArray, convertQueryParamToFloat } from '../utils/utils'
import { mapTypeIdToPluralEntityName, SlugEntity, SlugVerb } from '../utils/types'
import { getSlugActionFromQuery } from '../utils/slug'
import MapEventsListener from './MapEventsListener'
import MapLocationInitializer from './MapLocationInitializer'
import SearchEventsListener from './SearchEventsListener'
import 'leaflet/dist/leaflet.css'
import AddEntryButton from './AddEntryButton'
import BurgerMenu from './BurgerMenu'


const icons = {
  [Category.EVENT]: null,
  [Category.COMPANY]: null,
  [Category.INITIATIVE]: null,
  [Category.UNKNOWN]: null,
}

// memoize icons to prevent object creations
const getIcon = (types: Categories) => {
  // the reason we define types as array is because backend sends us an array of categories
  // and we won't ever know if in the feature we'll need to use the whole array or not
  const typeId = types[0]
  const icon = icons[typeId]

  if (!icon) {
    // const type = resultType.find(t => t.id === typeId) || Category.UNKNOWN
    const typeName = CategoryToNameMapper[typeId]
    icons[typeId] = new Icon({
      iconUrl: `/projects/main/pins/balloon_${typeName}.svg`,
      iconSize: new Point(50, 50),
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

  const markedPinLatLng: LatLng = latLng(convertQueryParamToFloat(query.pinLat), convertQueryParamToFloat(query.pinLng))
  const showMarkedPin = !!markedPinLatLng.lat && !!markedPinLatLng.lng

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

      <div id="map-bottom-right">
        <AddEntryButton/>
      </div>

      <div id="map-top-right">
        <BurgerMenu/>
      </div>


      <ZoomControl position="bottomright"/>

      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {
        showMarkedPin && (
          <Marker
            position={markedPinLatLng}
            icon={getIcon([Category.UNKNOWN])}
          >

          </Marker>
        )
      }

      {
        searchResults.map((searchResult: SearchResult) => (
          <Marker
            key={`map-marker-${searchResult.id}`}
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
import { FC, Fragment } from 'react'
import { SearchResult, SearchResults } from '../dtos/SearchResult'
import { useSelector } from 'react-redux'
import { RootState } from '../slices'
import searchResultSelector from '../selectors/searchResults'
import { Marker } from 'react-leaflet'
import Category, { CategoryToNameMapper } from '../dtos/Categories'
import { DivIcon, divIcon, Icon, IconOptions, Point } from 'leaflet'
import { NextRouter, useRouter } from 'next/router'
import { createSlugPathFromQueryAndRemoveSlug, getRootSlugActionFromQuery } from '../utils/slug'
import { mapTypeIdToBriefEntityName, SlugVerb } from '../utils/types'
import produce from 'immer'
import { convertQueryParamToArray } from '../utils/utils'
import SearchEntry from '../dtos/SearchEntry'


const balloonIcons: Record<Category, Icon<IconOptions> | DivIcon | null> = {
  [Category.EVENT]: null,
  [Category.COMPANY]: null,
  [Category.INITIATIVE]: null,
  [Category.UNKNOWN]: null,
}

const circuleIcons: Record<Category, Icon<IconOptions> | DivIcon | null> = {
  [Category.EVENT]: null,
  [Category.COMPANY]: null,
  [Category.INITIATIVE]: null,
  [Category.UNKNOWN]: null,
}

// memoize icons to prevent object creations
export const getBalloonIcon = (typeId: Category): Icon<IconOptions> | DivIcon => {
  const icon = balloonIcons[typeId]

  if (!icon) {
    // const type = resultType.find(t => t.id === typeId) || Category.UNKNOWN
    const typeName = CategoryToNameMapper[typeId]
    balloonIcons[typeId] = new Icon({
      iconUrl: `/projects/main/pins/balloon_${typeName}.svg`,
      iconSize: new Point(50, 50),
    })

    return balloonIcons[typeId]
  }

  return icon
}


// this function is inspired by the original implementation of KVM
// however a better idea would be to use CircleMarker from leaflet
// https://leafletjs.com/reference-1.7.1.html#circlemarker
const getCircleIcon = (typeId: Category): Icon<IconOptions> | DivIcon => {

  const categoryName = CategoryToNameMapper[typeId]

  const icon = divIcon({
    iconSize: new Point(20, 20),
    html: `
          <svg height="20" width="20">
             <circle
               class="${categoryName}-circle-marker"
               cx="10"
               cy="10"
               r="9"
               stroke="white"
               stroke-width="0.7"
               opacity=${1.0}
             />
          </svg>
        `,
  })

  return icon
}


const getIcon = (entity: SearchResult): Icon<IconOptions> | DivIcon => {

  const { categories: types } = entity

  // the reason we define types as array is because backend sends us an array of categories
  // and we won't ever know if in the feature we'll need to use the whole array or not
  const typeId = types[0]

  const hasRatings: boolean = !!(entity as SearchEntry).ratings
  if (hasRatings) {
    const rating: number = (entity as SearchEntry).ratings.total
    if (rating <= 0) {
      return getCircleIcon(typeId)
    }
  }

  return getBalloonIcon(typeId)
}


const onClickOnPin = (router: NextRouter, searchResult: SearchResult) => () => {
  const { query } = router
  const rootSlugAction = getRootSlugActionFromQuery(query)
  const { subSlugAction: entitySlugAction } = rootSlugAction

  // if we are in the middle of creating/editing an entity, clicking on pins should do nothing
  if (
    entitySlugAction !== null &&
    entitySlugAction.verb !== SlugVerb.SHOW
  ) {
    return null
  }

  const category = searchResult.categories[0]
  const briefEntityName = mapTypeIdToBriefEntityName[category]

  const newQueryParams = produce(query, draftState => {
    const { slug } = draftState
    const slugArray = convertQueryParamToArray(slug)

    if (entitySlugAction !== null) {
      slugArray.splice(slugArray.length - 2, 2)
    }

    slugArray.push(briefEntityName, searchResult.id)
    draftState.slug = slugArray

    // open the sidebar
    delete draftState.sidebar
  })

  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  router.replace(
    {
      pathname: `/m/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )
}


const MapMarkers: FC = () => {

  const router = useRouter()

  const searchResults: SearchResults = useSelector(
    (state: RootState) => searchResultSelector(state),
  )

  return (
    <Fragment>
      {
        searchResults.map((searchResult: SearchResult) => (
          <Marker
            key={`map-marker-${searchResult.id}`}
            position={[searchResult.lat, searchResult.lng]}
            icon={getIcon(searchResult)}
            eventHandlers={{
              click: onClickOnPin(router, searchResult),
            }}
          >

          </Marker>
        ))
      }
    </Fragment>
  )
}


export default MapMarkers
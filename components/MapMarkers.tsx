import { FC, Fragment } from 'react'
import { SearchResult, SearchResults } from '../dtos/SearchResult'
import { useSelector } from 'react-redux'
import { RootState } from '../slices'
import searchResultSelector from '../selectors/searchResults'
import { Marker } from 'react-leaflet'
import Category, { Categories, CategoryToNameMapper } from '../dtos/Categories'
import { Icon, Point } from 'leaflet'
import { NextRouter, useRouter } from 'next/router'
import { createSlugPathFromQueryAndRemoveSlug, getRootSlugActionFromQuery } from '../utils/slug'
import { mapTypeIdToBriefEntityName, SlugVerb } from '../utils/types'
import produce from 'immer'
import { convertQueryParamToArray } from '../utils/utils'
import toString from 'lodash/toString'


const icons = {
  [Category.EVENT]: null,
  [Category.COMPANY]: null,
  [Category.INITIATIVE]: null,
  [Category.UNKNOWN]: null,
}

// memoize icons to prevent object creations
export const getIcon = (types: Categories) => {
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
    draftState.isSidebarOpen = toString(true)
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
            icon={getIcon(searchResult.categories)}
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
import { FC, useEffect, useState, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { useSelector } from 'react-redux'
import { highlightSelector } from '../selectors/view'
import Category, { CategoryToNameMapper } from '../dtos/Categories'
import { DivIcon, divIcon, Icon, IconOptions, Marker, Point } from 'leaflet'
import { NextRouter, useRouter } from 'next/router'
import { CompactEvent } from '../dtos/Event'
import { createSlugPathFromQueryAndRemoveSlug, getRootSlugActionFromQuery } from '../utils/slug'
import { mapTypeIdToBriefEntityName, SlugVerb } from '../utils/types'
import { produce } from 'immer'
import { convertQueryParamToArray } from '../utils/utils'
import SearchEntry from '../dtos/SearchEntry'
import { SearchResult } from '../dtos/SearchResult'
import { Marker as LeafletMarker } from 'react-leaflet'
import MapMarkerTooltip from './MapMarkerTooltip'
import moment from 'moment'
import { RootState } from '../slices'
import { HighlightIDOrNull } from '../slices/viewSlice'
import { VIEW } from '../consts/view'
import MapMarkerBalloon from './MapMarkerBalloon'
import useTagMarkerColor from '../hooks/useTagMarkerColor'


const balloonIcons: Record<Category, Icon<IconOptions> | DivIcon | null> = {
  [Category.EVENT]: null,
  [Category.COMPANY]: null,
  [Category.INITIATIVE]: null,
  [Category.UNKNOWN]: null,
}

const getDefaultBalloonIcon = (typeId: Category): Icon<IconOptions> | DivIcon | null=> {
  const icon = balloonIcons[typeId]

  if (!icon) {
    const typeName = CategoryToNameMapper[typeId]
    balloonIcons[typeId] = new Icon({
      iconUrl: `/projects/main/pins/balloon_${typeName}.svg`,
      iconSize: new Point(50, 50),
    })

    return balloonIcons[typeId]
  }

  return icon
}

const getCustomColoredBalloonIcon = (color: string): DivIcon => (
  divIcon({
    iconSize: new Point(50, 50),
    html: renderToStaticMarkup(
      <MapMarkerBalloon color={color} />
    )
  })
)

// memoize icons to prevent object creations
export const getBalloonIcon = (typeId: Category, color=''): Icon<IconOptions> | DivIcon | null => {
  if (color) {
    return getCustomColoredBalloonIcon(color)
  }

  return getDefaultBalloonIcon(typeId)
}


// this function is inspired by the original implementation of KVM
// however a better idea would be to use CircleMarker from leaflet
// https://leafletjs.com/reference-1.7.1.html#circlemarker
const getCircleIcon = (typeId: Category, color: string): Icon<IconOptions> | DivIcon => {
  const categoryName = CategoryToNameMapper[typeId]

  const icon = divIcon({
    iconSize: new Point(20, 20),
    html: renderToStaticMarkup(
          <svg height='20' width='20'>
             <circle
               className={`${categoryName}-circle-marker`}
               cx='10'
               cy='10'
               r='9'
               stroke='white'
               strokeWidth='0.7'
               style={{
                 fill: color,
               }}
               opacity={1}
             />
          </svg>
    ),
  })

  return icon
}


const getIcon = (entity: SearchResult, possibleColor: string): Icon<IconOptions> | DivIcon | null => {
  const { categories: types } = entity

  // the reason we define types as array is because backend sends us an array of categories
  // and we won't ever know if in the feature we'll need to use the whole array or not
  const typeId = types[0]

  const hasRatings: boolean = !!(entity as SearchEntry).ratings
  if (hasRatings) {
    const rating: number = (entity as SearchEntry).ratings.total
    if (rating <= 0) {
      return getCircleIcon(typeId, possibleColor)
    }
  }

  return getBalloonIcon(typeId, possibleColor)
}


const onClickOnPin = (router: NextRouter, searchResult: SearchResult) => () => {
  const { query } = router
  const rootSlugAction = getRootSlugActionFromQuery(query)
  const { subSlugAction: entitySlugAction } = rootSlugAction

  const category = searchResult.categories[0]
  const briefEntityName = mapTypeIdToBriefEntityName[category]

  const newQueryParams = produce(query, (draftState) => {
    const { slug } = draftState
    const slugArray = convertQueryParamToArray(slug)

    if (entitySlugAction !== null) {
      switch (entitySlugAction.verb) {
        case SlugVerb.CREATE:
          slugArray.splice(slugArray.length - 2, 2)
          slugArray.push(briefEntityName, searchResult.id, SlugVerb.EDIT)
          break
        case SlugVerb.EDIT:
          slugArray.splice(slugArray.length - 3, 3)
          slugArray.push(briefEntityName, searchResult.id, SlugVerb.EDIT)
          break
        case SlugVerb.SHOW:
          slugArray.splice(slugArray.length - 2, 2)
          slugArray.push(briefEntityName, searchResult.id)
          break
      }
    } else {
      slugArray.push(briefEntityName, searchResult.id)
    }

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


export interface MapMarkerProps {
  searchResult: SearchResult,
}

const MapMarker: FC<MapMarkerProps> = (props) => {
  const { searchResult } = props
  const { tags } = searchResult
  const { id: searchResultId } = searchResult

  const router = useRouter()
  const highlightId: HighlightIDOrNull = useSelector(
    (state: RootState) => (highlightSelector(state)),
  )
  const isSelected = searchResultId === highlightId

  const [opacity, setOpacity] = useState<number>(VIEW.highlight.dark)

  const possibleColor = useTagMarkerColor(tags)

  const ref = useRef<Marker<any>>(null)

  // performance
  useEffect(() => {
    if (!highlightId) {
      setOpacity(VIEW.highlight.dark)
      ref.current?.closeTooltip()
      return
    }

    if (isSelected) {
      setOpacity(VIEW.highlight.dark)
      ref.current?.openTooltip()
    } else {
      setOpacity(VIEW.highlight.light)
      if (ref.current?.isTooltipOpen()) {
        ref.current.closeTooltip()
      }
    }
  }, [highlightId, isSelected])


  const possibleEvent = searchResult as CompactEvent

  return (
    <LeafletMarker
      ref={ref}
      position={[searchResult.lat, searchResult.lng]}
      icon={getIcon(searchResult, possibleColor) || undefined}
      eventHandlers={{
        click: onClickOnPin(router, searchResult),
      }}
      opacity={opacity}
    >
      <MapMarkerTooltip
        text={searchResult.title}
        duration={{
          start: moment.unix(possibleEvent.start),
          end: moment.unix(possibleEvent.end),
        }}
        direction="right"
        permanent={isSelected}
      />
    </LeafletMarker>
  )
}


export default MapMarker

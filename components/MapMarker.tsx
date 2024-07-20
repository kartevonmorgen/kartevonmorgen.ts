import { FC, useEffect, useState, useRef, useContext } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { useSelector } from 'react-redux'
import map from 'lodash/map'
import findIndex from 'lodash/findIndex'
import filter from 'lodash/filter'
import sortedUniq from 'lodash/sortedUniq'
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
import MapMarkerIcon from './MapMarkerIcon'
import MapMarkerTagsIconsContext from '../contexts'

const balloonIcons: Record<Category, Icon<IconOptions> | DivIcon | null> = {
  [Category.EVENT]: null,
  [Category.COMPANY]: null,
  [Category.INITIATIVE]: null,
  [Category.UNKNOWN]: null,
}

const getDefaultBalloonIcon = (
  typeId: Category,
  iconName: string | null,
): Icon<IconOptions> | DivIcon | null => {
  const typeName = CategoryToNameMapper[typeId]

  if (iconName !== null) {
    return divIcon({
      iconSize: new Point(50, 50),
      html: renderToStaticMarkup(
        <svg height="40" width="40">
          <image href={`/projects/main/pins/balloon_${typeName}.svg`} height={50} width={50} />
          <foreignObject x={20} y={13} width="12" height="12">
              <MapMarkerIcon icon={iconName} style={{ color: 'white' }} />
          </foreignObject>
        </svg>,
      ),
    })
  }

  const icon = balloonIcons[typeId]

  if (!icon) {
    balloonIcons[typeId] = new Icon({
      iconUrl: `/projects/main/pins/balloon_${typeName}.svg`,
      iconSize: new Point(50, 50),
    })

    return balloonIcons[typeId]
  }

  return icon
}

const getCustomColoredBalloonIcon = (color: string, iconName: string | null): DivIcon =>
  divIcon({
    iconSize: new Point(50, 50),
    html: renderToStaticMarkup(<MapMarkerBalloon color={color} icon={iconName} />),
  })

// memoize icons to prevent object creations
export const getBalloonIcon = (
  typeId: Category,
  color = '',
  iconName: string | null
): Icon<IconOptions> | DivIcon | null => {
  if (color) {
    return getCustomColoredBalloonIcon(color, iconName)
  }

  return getDefaultBalloonIcon(typeId, iconName)
}

// this function is inspired by the original implementation of KVM
// however a better idea would be to use CircleMarker from leaflet
// https://leafletjs.com/reference-1.7.1.html#circlemarker
const getCircleIcon = (
  typeId: Category,
  color: string,
  iconName: string | null,
): Icon<IconOptions> | DivIcon => {
  const categoryName = CategoryToNameMapper[typeId]

  return divIcon({
    iconSize: new Point(20, 20),
    html: renderToStaticMarkup(
      <svg height="20" width="20">
        <circle
          className={`${categoryName}-circle-marker`}
          cx="10"
          cy="10"
          r="9"
          stroke="white"
          strokeWidth="0.7"
          style={{
            fill: color,
          }}
          opacity={1}
        />

        {iconName !== null && (
          <foreignObject width="20" height="20">
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
              }}
            >
              <MapMarkerIcon icon={iconName} style={{ color: 'white' }} />
            </div>
          </foreignObject>
        )}
      </svg>,
    ),
  })
}

const getIcon = (
  entity: SearchResult,
  possibleColor: string,
  iconName: string | null,
): Icon<IconOptions> | DivIcon | null => {
  const { categories: types } = entity

  // the reason we define types as array is because backend sends us an array of categories
  // and we won't ever know if in the feature we'll need to use the whole array or not
  const typeId = types[0]

  const hasRatings: boolean = !!(entity as SearchEntry).ratings
  if (hasRatings) {
    const rating: number = (entity as SearchEntry).ratings.total
    if (rating <= 0) {
      return getCircleIcon(typeId, possibleColor, iconName)
    }
  }

  return getBalloonIcon(typeId, possibleColor, iconName)
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
  searchResult: SearchResult
}

const MapMarker: FC<MapMarkerProps> = (props) => {
  const { searchResult } = props
  const { tags } = searchResult
  const { id: searchResultId } = searchResult

  const router = useRouter()

  const tagsIcons = useContext(MapMarkerTagsIconsContext)

  let iconName: string | null = null
  const prioritySortedIndices = sortedUniq(
    filter(
      map(tags, (tag) => findIndex(tagsIcons, (tagIcon) => tagIcon.tag === tag)),
      (idx) => idx !== -1,
    ),
  )
  if (prioritySortedIndices.length !== 0) {
    iconName = tagsIcons[prioritySortedIndices[0]].icon
  }

  const highlightId: HighlightIDOrNull = useSelector((state: RootState) => highlightSelector(state))
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
      icon={getIcon(searchResult, possibleColor, iconName) || undefined}
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

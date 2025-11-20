import { FC, Fragment } from 'react'
import { SearchResult, SearchResults } from '../dtos/SearchResult'
import { useSelector } from 'react-redux'
import { RootState } from '../slices'
import searchResultSelector from '../selectors/searchResults'
import MapMarker from './MapMarker'
import useRatingsVisibility from '../hooks/useRatingsVisibility'


const MapMarkers: FC = () => {
  // useCacheTagPinColors()

  const searchResults: SearchResults = useSelector(
    (state: RootState) => searchResultSelector(state),
  )

  const showRatings = useRatingsVisibility()
  
  // When ratings are hidden, show only dots (circles) instead of balloons/pins
  const forceDots = !showRatings

  return (
    <Fragment>
      {
        searchResults.map((searchResult: SearchResult) => (
          <MapMarker
            key={`map-marker-${searchResult.id}`}
            searchResult={searchResult}
            forceDots={forceDots}
          />
        ))
      }
    </Fragment>
  )
}


export default MapMarkers

import { FC, Fragment } from 'react'
import { SearchResult, SearchResults } from '../dtos/SearchResult'
import { useSelector } from 'react-redux'
import { RootState } from '../slices'
import searchResultSelector from '../selectors/searchResults'
import MapMarker from './MapMarker'


const MapMarkers: FC = () => {
  const searchResults: SearchResults = useSelector(
    (state: RootState) => searchResultSelector(state),
  )

  return (
    <Fragment>
      {
        searchResults.map((searchResult: SearchResult) => (
          <MapMarker
            key={`map-marker-${searchResult.id}`}
            searchResult={searchResult}
          />
        ))
      }
    </Fragment>
  )
}


export default MapMarkers

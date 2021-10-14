import { FC, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { List } from 'antd'
import { useBoolean } from 'ahooks'
import { RootState } from '../slices'
import searchResultSelector from '../selectors/searchResults'
import { SearchResults } from '../dtos/SearchResult'
import ResultCard from './ResultCard'
import SidebarZoomOutButton from './SidebarZoomOutButton'


const MIN_REQUIRED_RESULTS = 20


interface ResultListProps {
}

const ResultList: FC<ResultListProps> = (_props) => {


  const searchResults: SearchResults = useSelector(
    (state: RootState) => searchResultSelector(state),
  )
  const { length: numberOfSearchResults } = searchResults

  const [
    isSidebarZoomOutButtonVisible,
    {
      setTrue: showSidebarZoomOutButton,
      setFalse: hideSidebarZoomOutButton,
    },
  ] = useBoolean()

  useEffect(() => {

    if (numberOfSearchResults < MIN_REQUIRED_RESULTS) {
      showSidebarZoomOutButton()
    } else {
      hideSidebarZoomOutButton()
    }

  }, [searchResults.length])

  if (numberOfSearchResults === 0) {
    return null
  }

  return (
    <List
      itemLayout="vertical"
      size="large"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {
        searchResults.map(searchResult => (
          <ResultCard
            key={searchResult.id}
            searchResult={searchResult}
          />
        ))
      }

      <SidebarZoomOutButton
        visible={isSidebarZoomOutButtonVisible}
      />
    </List>
  )
}


export default ResultList
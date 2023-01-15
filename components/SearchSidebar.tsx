import { FC, Fragment } from 'react'
import ResultList from './ResultList'
import SearchControllers from './SearchControllers'
import AddEntryButton from './AddEntryButton'


const SearchSidebar: FC = () => {
  return (
    <Fragment>
      <SearchControllers/>

      <div
        style={{
          flex: '1 1 auto',
          paddingBottom: 32,
        }}
      >
        <ResultList/>
      </div>

      <AddEntryButton
        type="primary"
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 0,
          left: 0,
        }}
      />
    </Fragment>
  )
}


export default SearchSidebar

import { FC, Fragment } from 'react'
import ResultList from './ResultList'
import SearchControllers from './SearchControllers'


const SearchSidebar: FC = () => {

  return (
    <Fragment>

      <SearchControllers/>

      <div
        style={{
          flex: '1 1 auto',
        }}
      >
        <ResultList/>
      </div>
    </Fragment>
  )
}


export default SearchSidebar
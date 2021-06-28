import { FC, Fragment } from 'react'

import ResultList from './ResultList'
import SearchControllers from './SearchControllers'


const SearchSidebar: FC = (_props) => {
  return (
    <Fragment>

      <SearchControllers/>

      <div style={{ flexGrow: 1 }}>
        <ResultList/>
      </div>
    </Fragment>
  )
}


export default SearchSidebar
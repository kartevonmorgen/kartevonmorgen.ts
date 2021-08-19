import { FC, Fragment } from 'react'

import ResultList from './ResultList'
import SearchControllers from './SearchControllers'
import SidebarZoomOutButton from './SidebarZoomOutButton'


const SearchSidebar: FC = (_props) => {
  return (
    <Fragment>

      <SearchControllers/>

      <div style={{ flexGrow: 1 }}>
        <ResultList/>

        <SidebarZoomOutButton/>
      </div>
    </Fragment>
  )
}


export default SearchSidebar
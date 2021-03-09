import { FC, Fragment } from 'react'

import SidebarNav from './SidebarNav'
import ResultList from './ResultList'
import SearchControllers from './SearchControllers'
import { TagsCount } from '../dtos/TagCount'


export interface SearchSidebarProps {
  tagsCount: TagsCount
}


const SearchSidebar: FC<SearchSidebarProps> = (props) => {
  return (
    <Fragment>
      {/*todo: create a background of dark with bottom shadow*/}
      <SidebarNav/>

      <SearchControllers tagsCount={props.tagsCount}/>

      <div style={{ flexGrow: 1 }}>
        <ResultList/>
      </div>
    </Fragment>
  )
}


export default SearchSidebar
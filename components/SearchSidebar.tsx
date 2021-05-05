import { FC, Fragment } from 'react'

import ResultList from './ResultList'
import SearchControllers from './SearchControllers'
import { TagsCount } from '../dtos/TagCount'


export interface SearchSidebarProps {
  tagsCount: TagsCount
}


const SearchSidebar: FC<SearchSidebarProps> = (props) => {
  return (
    <Fragment>

      <SearchControllers tagsCount={props.tagsCount}/>

      <div style={{ flexGrow: 1 }}>
        <ResultList/>
      </div>
    </Fragment>
  )
}


export default SearchSidebar
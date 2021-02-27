import { FC, Fragment } from 'react'

import NavSidebar from './NavSidebar'
import SearchInput from './SearchInput'
import Filters, { FiltersProps } from './Filters'
import ResultList from './ResultList'


export interface SearchSidebarProps extends FiltersProps {

}


const SearchSidebar: FC<SearchSidebarProps> = (props) => {
  return (
    <Fragment>
      {/*todo: create a background of dark with bottom shadow*/}
      <NavSidebar/>

      {/*todo: make the search component a separate component to prevent unnecessary renders*/}
      <SearchInput/>

      <Filters
        tagsCount={props.tagsCount}
      />

      <div style={{ flexGrow: 1 }}>
        <ResultList/>
      </div>
    </Fragment>
  )
}


export default SearchSidebar
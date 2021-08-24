import { FC, Fragment } from 'react'
import { useBoolean } from 'ahooks'
import ResultList from './ResultList'
import SearchControllers from './SearchControllers'
import SidebarZoomOutButton from './SidebarZoomOutButton'


const SearchSidebar: FC = () => {

  const [
    isSidebarZoomOutButtonVisible,
    {
      setTrue: showSidebarZoomOutButton,
      setFalse: hideSidebarZoomOutButton,
    },
  ] = useBoolean()

  return (
    <Fragment>

      <SearchControllers/>

      <div
        style={{
          flex: '1 1 auto',
        }}
      >
        <ResultList
          showSidebarZoomOutButton={showSidebarZoomOutButton}
          hideSidebarZoomOutButton={hideSidebarZoomOutButton}
        />

        <SidebarZoomOutButton
          visible={isSidebarZoomOutButtonVisible}
        />
      </div>
    </Fragment>
  )
}


export default SearchSidebar
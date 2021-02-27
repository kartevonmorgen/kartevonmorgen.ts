import { FC } from 'react'
import { useRouter } from 'next/router'
import SearchSidebar, { SearchSidebarProps } from './SearchSidebar'
import { getSlugActionFromQuery } from '../utils/slug'
import { SlugEntity } from '../utils/type'


interface SidebarProps extends SearchSidebarProps {

}

const Sidebar: FC<SidebarProps> = (props) => {
  const router = useRouter()
  const {query} = router

  const slugAction = getSlugActionFromQuery(query)

  switch (slugAction.entity) {
    case SlugEntity.RESULTS:
      return (
        <SearchSidebar tagsCount={props.tagsCount}/>
      )
    default:
      return null
  }
}


export default Sidebar
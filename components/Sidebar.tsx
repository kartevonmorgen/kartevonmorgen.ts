import { FC } from 'react'
import { useRouter } from 'next/router'
import { getSlugActionFromQuery } from '../utils/slug'
import { SlugEntity } from '../utils/types'
import SearchSidebar, { SearchSidebarProps } from './SearchSidebar'
import Entry from './Entry'
import Event from './Event'


interface SidebarProps extends SearchSidebarProps {

}

const Sidebar: FC<SidebarProps> = (props) => {
  const router = useRouter()
  const { query } = router

  const slugAction = getSlugActionFromQuery(query)
  console.log(slugAction)

  switch (slugAction.entity) {
    case SlugEntity.ENTRY:
      return <Entry/>
    case SlugEntity.EVENT:
      return <Event/>
    default:
      return <SearchSidebar tagsCount={props.tagsCount}/>
  }
}


export default Sidebar
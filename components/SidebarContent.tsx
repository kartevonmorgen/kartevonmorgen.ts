import { FC } from 'react'
import { useRouter } from 'next/router'
import { getSlugActionFromQuery } from '../utils/slug'
import { SlugEntity } from '../utils/types'
import SearchSidebar from './SearchSidebar'
import Entry from './Entry'
import Event from './Event'


const SidebarContent: FC = (_props) => {
  const router = useRouter()
  const { query } = router

  const slugAction = getSlugActionFromQuery(query)

  switch (slugAction.entity) {
    case SlugEntity.ENTRY:
      return <Entry/>
    case SlugEntity.EVENT:
      return <Event/>
    default:
      return <SearchSidebar/>
  }
}


export default SidebarContent
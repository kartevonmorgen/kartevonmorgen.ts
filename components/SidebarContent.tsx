import { FC } from 'react'
import { useRouter } from 'next/router'
import { getRootSlugActionFromQuery } from '../utils/slug'
import SearchSidebar from './SearchSidebar'
import SidebarContentChild from './SidebarContentChild'


const SidebarContent: FC = (_props) => {
  const router = useRouter()
  const { query } = router

  const slugAction = getRootSlugActionFromQuery(query)
  const { subSlugAction } = slugAction

  if (subSlugAction !== null) {
    return <SidebarContentChild slugAction={subSlugAction}/>
  }

  return <SearchSidebar/>
}


export default SidebarContent

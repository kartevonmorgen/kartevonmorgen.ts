import { FC } from 'react'
import { useRouter } from 'next/router'
import SearchSidebar, { SearchSidebarProps } from './SearchSidebar'
import { getSlugActionFromQuery } from '../utils/slug'
import { SingularSlugEntity } from '../utils/types'


interface SidebarProps extends SearchSidebarProps {

}

const Sidebar: FC<SidebarProps> = (props) => {
  const router = useRouter()
  const {query} = router

  const slugAction = getSlugActionFromQuery(query)

  switch (slugAction.entity) {
    case SingularSlugEntity.ENTRY:
      return null
    case SingularSlugEntity.EVENT:
      return null
    default:
      return <SearchSidebar tagsCount={props.tagsCount}/>
  }
}


export default Sidebar
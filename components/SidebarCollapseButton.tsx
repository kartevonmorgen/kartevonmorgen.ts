import { FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { Button } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSidebar } from '../hooks/useResponsive'
import { convertQueryParamToString, removeRoutingQueryParams, updateRoutingQuery } from '../utils/utils'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'
import { isRouterInitialized } from '../utils/router'
import SidebarStatus, { isSidebarStatusShown } from '../dtos/SidebarStatus'


export enum SidebarState {
  Close,
  Open
}


const setSidebarState = (router: NextRouter, sidebarOpenState: SidebarState) => {
  const { query } = router

  let newQueryParams = {}
  if (sidebarOpenState === SidebarState.Open) {
    newQueryParams = removeRoutingQueryParams(query, ['sidebar'])
  } else {
    newQueryParams = updateRoutingQuery(query, {
      sidebar: SidebarStatus.HIDDEN,
    })
  }

  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  router.replace(
    {
      pathname: `/m/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )
}

export const closeSidebar = (router: NextRouter) => {
  setSidebarState(router, SidebarState.Close)
}

export const openSidebar = (router: NextRouter) => {
  setSidebarState(router, SidebarState.Open)
}

export const toggleSidebarState = (router: NextRouter, isSidebarOpen: boolean) => () => {
  if (!isRouterInitialized(router)) {
    return
  }

  if (isSidebarOpen) {
    closeSidebar(router)

    return
  }

  openSidebar(router)
}


interface CollapseSidebarButtonIcon {
  showOpenIcon: boolean
}

const SidebarCollapseButtonIcon: FC<CollapseSidebarButtonIcon> = (props) => {
  const { showOpenIcon } = props

  if (showOpenIcon) {
    return <FontAwesomeIcon icon='chevron-right' />
  }

  return <FontAwesomeIcon icon='chevron-left' />
}

const SidebarCollapseButton: FC = () => {
  const router = useRouter()
  
  return (
    <Button
      icon={
        <SidebarCollapseButtonIcon showOpenIcon />
      }
      onClick={toggleSidebarState(router, false)}
      size='middle'
      style={{
        height: 68,
        width: 36,
        position: 'fixed',
        top: 52,
        left: 0,
        zIndex: 500,
        visibility: 'visible',
        display: 'block'
      }}
    />
  )
}


export default SidebarCollapseButton

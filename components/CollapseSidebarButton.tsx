import React, { FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { Button } from 'antd'
import TweenOne from 'rc-tween-one'
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

const toggleSidebarState = (router: NextRouter, isSidebarOpen: boolean) => () => {
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

const CollapseSidebarButtonIcon: FC<CollapseSidebarButtonIcon> = (props) => {
  const { showOpenIcon } = props

  if (showOpenIcon) {
    return <FontAwesomeIcon icon="chevron-right"/>
  }

  return <FontAwesomeIcon icon="chevron-left"/>
}

const CollapseSidebarButton: FC = () => {
  const router = useRouter()
  const { query } = router
  const { sidebar: sidebarParam } = query
  const isSidebarOpen = isSidebarStatusShown(convertQueryParamToString(sidebarParam))

  const { width: sidebarWidth } = useSidebar()

  return (
    <TweenOne
      reverse={!isSidebarOpen}
      animation={{ x: sidebarWidth, duration: 300 }}
      style={{
        position: 'fixed',
        top: 90,
        zIndex: 400,
      }}
    >
      <Button
        icon={
          <CollapseSidebarButtonIcon showOpenIcon={!isSidebarOpen}/>
        }
        onClick={toggleSidebarState(router, isSidebarOpen)}
        size="small"
        style={{
          height: 40,
        }}
      />
    </TweenOne>
  )
}


export default CollapseSidebarButton

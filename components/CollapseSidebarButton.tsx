import React, { FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { Button } from 'antd'
import TweenOne from 'rc-tween-one'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { convertQueryParamToBoolean, updateRoutingQuery } from '../utils/utils'
import toString from 'lodash/toString'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'
import { isRouterInitialized } from '../utils/router'


export enum SidebarState {
  Close,
  Open
}


const setSidebarState = (router: NextRouter, sidebarOpenState: SidebarState) => {
  const { query } = router

  const newQueryParams = updateRoutingQuery(query, {
    isSidebarOpen: toString(Boolean(sidebarOpenState)),
  })
  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  router.replace(
    {
      pathname: `/maps/${newPath}`,
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
  const { isSidebarOpen: isSidebarOpenQueryParam } = query
  const isSidebarOpen = convertQueryParamToBoolean(isSidebarOpenQueryParam)

  return (
    <TweenOne
      reverse={!isSidebarOpen}
      animation={{ x: '32vw', duration: 300 }}
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
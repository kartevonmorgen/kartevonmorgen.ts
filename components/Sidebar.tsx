import { Dispatch, FC, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'
import SidebarContent from './SidebarContent'
import { Drawer } from 'antd'
import toString from 'lodash/toString'
import { convertQueryParamToBoolean, updateRoutingQuery } from '../utils/utils'
import { isRouterInitialized } from '../utils/router'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'


const toggleSidebarWidth = (setSidebarWidth: Dispatch<string>) => (broken: boolean): void => {
  if (broken) {
    setSidebarWidth('60vw')

    return
  }

  setSidebarWidth('32vw')
}


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

const toggleSidebarState = (router: NextRouter, isSidebarOpen: boolean) => {
  if (!isRouterInitialized(router)) {
    return
  }

  if (isSidebarOpen) {
    closeSidebar(router)

    return
  }

  openSidebar(router)
}


const Sidebar: FC = () => {
  const router = useRouter()
  const {
    query: {
      isSidebarOpen: isSidebarOpenParam,
    },
  } = router

  const isSidebarOpen = convertQueryParamToBoolean(isSidebarOpenParam)

  const [sidebarWidth, setSidebarWidth] = useState<string>('32vw')

  return (
    <Drawer
      visible
      placement="left"
      closable={false}
      mask={false}
      width={sidebarWidth}
      bodyStyle={{
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {isSidebarOpen && <SidebarContent/>}
    </Drawer>
  )
}


export default Sidebar
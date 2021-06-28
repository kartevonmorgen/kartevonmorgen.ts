import { Dispatch, FC, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'
import SidebarContent from './SidebarContent'
import { Layout } from 'antd'
import toString from 'lodash/toString'
import { convertQueryParamToBoolean, updateRoutingQuery } from '../utils/utils'


const { Sider } = Layout


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

  console.log('new params should be: ', newQueryParams)

  router.replace(
    {
      pathname: '/maps/[...slug]',
      query: newQueryParams,
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
    <Sider
      breakpoint="lg"
      onBreakpoint={toggleSidebarWidth(setSidebarWidth)}
      theme="light"
      collapsible
      collapsed={!isSidebarOpen}
      onCollapse={() => toggleSidebarState(router, isSidebarOpen)}
      width={sidebarWidth}
      collapsedWidth={32}
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      {isSidebarOpen && <SidebarContent/>}
    </Sider>
  )
}


export default Sidebar
import {FC, useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import { Drawer } from 'antd'
import SidebarContent from './SidebarContent'
import SidebarCollapseButton from './SidebarCollapseButton'
import {convertQueryParamToString} from '../utils/utils'
import {isSidebarStatusShown} from '../dtos/SidebarStatus'
import {useSidebar} from '../hooks/useResponsive'
import { closeSidebar } from './SidebarCollapseButton'


interface SidebarProps {
  title: String
}


const Sidebar: FC<SidebarProps> = (props) => {
  const ClientDrawer = useMemo(() => dynamic(
    () => Promise.resolve(Drawer),
    {
      ssr: false,
    },
  ), [])

  const router = useRouter()
  const {
    query: {
      sidebar: sidebarParam,
    },
  } = router

  const shouldOpenSidebar = isSidebarStatusShown(convertQueryParamToString(sidebarParam))

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

  const {width: sidebarWidth} = useSidebar()

  useEffect(() => {
    setIsSidebarOpen(shouldOpenSidebar)
  }, [shouldOpenSidebar])

  return (
    <ClientDrawer
      autoFocus={false}
      closable={false}
      forceRender
      open={isSidebarOpen}
      placement="left"
      mask={false}
      rootStyle={{
        height: '100vh',
        padding: 0,
        display: 'flex',
        overflowX: 'clip',
        overflowY: 'scroll',
      }}
      getContainer={false}
      width={isSidebarOpen ? sidebarWidth : 0}
      styles={{
        body: {
          padding: 0
        },
        wrapper: {
          display: 'block'
        }
      }}
    >
      <SidebarCollapseButton />
      {isSidebarOpen && (
        <SidebarContent/>
      )}
    </ClientDrawer>
  )
}


export default Sidebar

import {FC, useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import { Drawer } from 'antd'
import SidebarContent from './SidebarContent'
import SidebarCollapseButton from './SidebarCollapseButton'
import {convertQueryParamToString} from '../utils/utils'
import {isSidebarStatusShown} from '../dtos/SidebarStatus'
import {useSidebar} from '../hooks/useResponsive'


interface SidebarProps {
  title: string
}


const Sidebar: FC<SidebarProps> = (props) => {
  const { title } = props

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
      title={title.length !== 0 ? title : undefined}
    >
      <SidebarCollapseButton />
      {isSidebarOpen && (
        <SidebarContent/>
      )}
    </ClientDrawer>
  )
}


export default Sidebar

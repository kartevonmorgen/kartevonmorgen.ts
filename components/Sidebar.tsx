import {FC, useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {Drawer} from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import SidebarContent from './SidebarContent'
import {convertQueryParamToString} from '../utils/utils'
import {isSidebarStatusShown} from '../dtos/SidebarStatus'
import {useSidebar} from '../hooks/useResponsive'
import { closeSidebar } from './SidebarCollapseButton'



interface SidebarProps {
  title: String
}


const Sidebar: FC<SidebarProps> = (props) => {
  const { title } = props


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
    <Drawer
      autoFocus={false}
      open={isSidebarOpen}
      closeIcon={<LeftOutlined/>}
      placement="left"
      mask={false}
      rootStyle={{
        height: '100vh',
        padding: 0,
        display: 'flex',
        overflowX: 'clip',
        overflowY: 'scroll',
        position: 'absolute',
      }}
      getContainer={false}
      width={isSidebarOpen ? sidebarWidth : 0}
      styles={{
        body: {
          padding: 0
        },
        header: {
          padding: 6,
        }
      }}
      title={title}
      onClose={() => closeSidebar(router)}
    >
      {isSidebarOpen && (
        <SidebarContent/>
      )}
    </Drawer>
  )
}


export default Sidebar

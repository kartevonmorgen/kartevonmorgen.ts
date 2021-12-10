import { FC } from 'react'
import { useRouter } from 'next/router'
import { Drawer } from 'antd'
import SidebarContent from './SidebarContent'
import { convertQueryParamToString } from '../utils/utils'
import { isSidebarStatusShown } from '../dtos/SidebarStatus'
import { useSidebar } from '../hooks/useResponsive'


const Sidebar: FC = () => {
  const router = useRouter()
  const {
    query: {
      sidebar: sidebarParam,
    },
  } = router

  const isSidebarOpen = isSidebarStatusShown(convertQueryParamToString(sidebarParam))

  const { width: sidebarWidth } = useSidebar()


  return (
    <Drawer
      visible={isSidebarOpen}
      placement="left"
      closable={false}
      mask={false}
      bodyStyle={{
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
      width={sidebarWidth}
    >

      {isSidebarOpen && <SidebarContent/>}

    </Drawer>
  )
}


export default Sidebar

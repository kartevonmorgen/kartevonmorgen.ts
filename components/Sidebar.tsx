import { FC } from 'react'
import { useRouter } from 'next/router'
import { Drawer } from 'antd'
import SidebarContent from './SidebarContent'
import { convertQueryParamToString } from '../utils/utils'
import { isSidebarStatusShown } from '../dtos/SidebarStatus'
import { useSidebar } from '../hooks/useResponsive'
import SidebarCollapseButton from './SidebarCollapseButton'


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
    (<Drawer
      autoFocus={false}
      open={isSidebarOpen}
      placement='left'
      closable={false}
      contentWrapperStyle={{
        display: 'block',
        width: isSidebarOpen ? sidebarWidth : 0,
      }}
      mask={false}
      bodyStyle={{
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'clip'
      }}
      width={sidebarWidth}
    >
      <SidebarCollapseButton />
      {isSidebarOpen && <SidebarContent />}
    </Drawer>)
  );
}


export default Sidebar

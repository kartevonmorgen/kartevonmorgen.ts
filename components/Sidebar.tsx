import { FC } from 'react'
import { useRouter } from 'next/router'
import { Drawer } from 'antd'
import SidebarContent from './SidebarContent'
import { convertQueryParamToString } from '../utils/utils'
import { isSidebarStatusShown } from '../dtos/SidebarStatus'
import useMobileDetect from '../hooks/useMobileDetect'


const Sidebar: FC = () => {
  const router = useRouter()
  const {
    query: {
      sidebar: sidebarParam,
    },
  } = router

  const isSidebarOpen = isSidebarStatusShown(convertQueryParamToString(sidebarParam))

  const device = useMobileDetect()
  const sidebarWidth: string = device.isMobile() ? '60vw' : '32vw'


  return (
    <Drawer
      visible={isSidebarOpen}
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

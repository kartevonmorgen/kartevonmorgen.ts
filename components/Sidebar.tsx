import { Dispatch, FC, useState } from 'react'
import { useRouter } from 'next/router'
import { Drawer } from 'antd'
import SidebarContent from './SidebarContent'
import { convertQueryParamToBoolean } from '../utils/utils'


const toggleSidebarWidth = (setSidebarWidth: Dispatch<string>) => (broken: boolean): void => {
  if (broken) {
    setSidebarWidth('60vw')

    return
  }

  setSidebarWidth('32vw')
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
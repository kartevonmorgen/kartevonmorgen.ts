import { Dispatch, FC, Fragment, useMemo, useState } from 'react'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { useToggle } from 'ahooks'
import { Layout, Spin } from 'antd'
import { AxiosInstance } from '../../api'
import MapPageConfigs from '../../dtos/MapPageConfigs'
import API_ENDPOINTS from '../../api/endpoints'
import { convertQueryParamToArray } from '../../utils/utils'
import RouterQueryInitializer from '../../components/RouterQueryInitializer'
import { MapLocationProps } from '../../components/Map'
import { TagsCount } from '../../dtos/TagCount'
import Sidebar from '../../components/Sidebar'

const { Content, Sider } = Layout


const toggleSidebarWidth = (setSidebarWidth: Dispatch<string>) => (broken: boolean): void => {
  if (broken) {
    setSidebarWidth('60vw')

    return
  }

  setSidebarWidth('32vw')
}


interface MapPageProps {
  popularTags: TagsCount
  mapLocationProps: MapLocationProps,
  project: string
}


const MapPage: FC<MapPageProps> = (props) => {
  const { mapLocationProps } = props

  const [
    isLoading,
    {
      setRight: setNotLoading,
    },
  ] = useToggle(true)

  const [sidebarWidth, setSidebarWidth] = useState<string>('32vw')

  const Map = useMemo(() => dynamic(
    () => import('../../components/Map').then(
      (mod) => {
        setNotLoading()
        return mod.default
      },
    ),
    {
      ssr: false,
    },
  ), [])

  const [isSideBarCollapsed, { toggle: toggleIsSideBarCollapsed }] = useToggle()

  return (
    <Fragment>
      <RouterQueryInitializer
        initMapLocationProps={mapLocationProps}
      />

      <Layout
        hasSider
      >
        <Sider
          breakpoint="lg"
          onBreakpoint={toggleSidebarWidth(setSidebarWidth)}
          theme="light"
          collapsible
          collapsed={isSideBarCollapsed}
          onCollapse={toggleIsSideBarCollapsed}
          width={sidebarWidth}
          collapsedWidth={32}
          style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {!isSideBarCollapsed && <Sidebar/>}
        </Sider>

        <Content>
          <Spin spinning={isLoading}>
            <div id="map">
              <Map/>
            </div>
          </Spin>
        </Content>

      </Layout>
    </Fragment>
  )
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.params
  const path = convertQueryParamToArray(slug)

  // we expect to have path always not empty with the first element of project name
  const project = path[0]

  // set configs
  const pageConfigsReq = await AxiosInstance.GetRequest<MapPageConfigs>(
    API_ENDPOINTS.getMapPageConfigs(project),
  )

  const pageConfigs = AxiosInstance.GetSuccessData(pageConfigsReq)
  const mapLocationProps = pageConfigs.map.location


  //todo: move the re-validate value to constants
  return {
    props: {
      mapLocationProps,
      project,
    },
  }
}

export default MapPage
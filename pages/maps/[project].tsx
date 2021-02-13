import { FC, Fragment, useMemo } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import { useToggle } from 'ahooks'

import { Layout, Spin } from 'antd'

import { AxiosInstance } from '../../api'
import MapPageConfigs from './types'
import API_ENDPOINTS from '../../api/endpoints'
import { convertQueryParamToString } from '../../utils/utils'

import ResultList from '../../components/ResultList'
import Filters from '../../components/Filters'
import NavSidebar from '../../components/NavSidebar'
import SearchInput from '../../components/SearchInput'
import RouterEventsListener from '../../components/RouterEventsListener'

import { MapLocationProps } from '../../components/Map'

const { Content, Sider } = Layout


interface MapPageProps {
  popularTags: string[]
  mapLocationProps: MapLocationProps
}

const MapPage: FC<MapPageProps> = (props) => {
  const { mapLocationProps } = props

  const [
    isLoading,
    {
      setRight: setNotLoading,
    },
  ] = useToggle(true)

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

  // const {popularTags} = props
  const [isSideBarCollapsed, { toggle: toggleIsSideBarCollapsed }] = useToggle()

  return (
    <Fragment>
      <RouterEventsListener
        initMapLocationProps={mapLocationProps}
      />

      <Layout
        hasSider
      >
        <Sider
          theme="light"
          collapsible
          collapsed={isSideBarCollapsed}
          onCollapse={toggleIsSideBarCollapsed}
          width="48vw"
          trigger={null}
          style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >

          {/*todo: create a background of dark with bottom shadow*/}
          <NavSidebar/>

          {/*todo: make the search component a separate component to prevent unnecessary renders*/}
          <SearchInput/>

          <Filters/>

          <div style={{ flexGrow: 1 }}>
            <ResultList/>
          </div>

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

export const getStaticPaths: GetStaticPaths = async (_ctx) => {
  //todo: read the project names from /public/projects dynamically with the re-validate policy
  return {
    paths: [
      { params: { project: 'main' } },
    ],
    fallback: false,
  }
}


export const getStaticProps: GetStaticProps = async (ctx) => {
  const { project } = ctx.params

  const pageConfigsReq = await AxiosInstance.GetRequest<MapPageConfigs>(
    API_ENDPOINTS.getMapPageConfigs(
      convertQueryParamToString(project),
    ),
  )

  const pageConfigsData = AxiosInstance.GetSuccessData(pageConfigsReq)
  const mapLocationProps = pageConfigsData.map.location

  //todo: move the re-validate value to constants
  return {
    props: {
      mapLocationProps,
    },
  }
}

export default MapPage
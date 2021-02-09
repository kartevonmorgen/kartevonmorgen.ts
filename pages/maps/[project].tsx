import { FC, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useToggle } from 'ahooks'

import { convertQueryParamToFloat } from '../../utils/utils'

import { Layout, Spin } from 'antd'
import ResultList from '../../components/ResultList'
import Filters from '../../components/Filters'
import NavSidebar from '../../components/NavSidebar'
import SearchInput from '../../components/SearchInput'
import { MapLocationProps } from '../../components/map'

import MAP_CONSTANTS from '../../consts/map'

const { Content, Sider } = Layout


interface MapPageProps {
  popularTags: string[]
  mapLocationProps: MapLocationProps
}

const MapPage: FC<MapPageProps> = (props) => {
  const {mapLocationProps} = props

  const router = useRouter()
  const {query} = router

  const [
    isLoading,
    {
      setRight: setNotLoading,
    },
  ] = useToggle(true)

  const Map = useMemo(() => dynamic(
    () => import('../../components/map').then(
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

  useEffect(() => {
    const {lat:latParam, lng:lngParam, zoom:zoomParam} = query
    const lat:string = latParam ?
      convertQueryParamToFloat(latParam).toPrecision(MAP_CONSTANTS.precisions.lat) :
      mapLocationProps.lat.toPrecision(MAP_CONSTANTS.precisions.lat)
    const lng:string = lngParam ?
      convertQueryParamToFloat(lngParam).toPrecision(MAP_CONSTANTS.precisions.lng) :
      mapLocationProps.lng.toPrecision(MAP_CONSTANTS.precisions.lng)
    const zoom:string = zoomParam ?
      convertQueryParamToFloat(zoomParam).toPrecision(MAP_CONSTANTS.precisions.zoom) :
      mapLocationProps.zoom.toPrecision(MAP_CONSTANTS.precisions.zoom)


  }, [])

  return (
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
  )
}


export default MapPage
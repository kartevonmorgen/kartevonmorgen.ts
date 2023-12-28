import { FC, Fragment, useMemo } from 'react'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { useToggle } from 'ahooks'
import { Layout, Spin } from 'antd'
import { AxiosInstance } from '../../api'
import MapPageConfigs, { SidebarConfigs } from '../../dtos/MapPageConfigs'
import API_ENDPOINTS from '../../api/endpoints'
import { convertQueryParamToArray } from '../../utils/utils'
import RouterQueryInitializer from '../../components/RouterQueryInitializer'
import { MapLocationProps } from '../../components/Map'
import { TagsCount } from '../../dtos/TagCount'
import Sidebar from '../../components/Sidebar'
import { MapColorModes } from '../../components/MapColorStyle'


const { Content } = Layout


interface MapPageProps {
  popularTags: TagsCount
  mapLocationProps: MapLocationProps,
  sidebarConfigs: SidebarConfigs
  initMapColorStyle: MapColorModes  
}


const MapPage: FC<MapPageProps> = (props) => {
  const { mapLocationProps, sidebarConfigs, initMapColorStyle } = props

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


  return (
    <Fragment>
      <RouterQueryInitializer
        initMapLocationProps={mapLocationProps}
        initMapColorStyle={initMapColorStyle}
      />

      <Sidebar {...sidebarConfigs}/>

      <Content>
        <Spin spinning={isLoading}>
          <div id="map">
            <Map
              lat={mapLocationProps.lat}
              lng={mapLocationProps.lng}
              zoom={mapLocationProps.zoom}
            />
          </div>
        </Spin>
      </Content>

    </Fragment>
  )
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = ctx.params?.slug
  const path = convertQueryParamToArray(slug)

  // we expect to have path always not empty with the first element of project name
  const project = path[0]

  // set configs
  const pageConfigsReq = await AxiosInstance.GetRequest<MapPageConfigs>(
    API_ENDPOINTS.getMapPageConfigs(project),
  )

  const pageConfigs = AxiosInstance.GetSuccessData(pageConfigsReq)

  const mapLocationProps = pageConfigs.map.location
  const sidebarConfigs = pageConfigs.sidebar
  const initMapColorStyle = pageConfigs.map.colorStyle

  // todo: move the re-validate value to constants
  return {
    props: {
      mapLocationProps,
      sidebarConfigs,
      initMapColorStyle,
    },
  }
}

export default MapPage

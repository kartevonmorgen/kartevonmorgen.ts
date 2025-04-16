import { FC, Fragment, useMemo } from 'react'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { useToggle } from 'ahooks'
import { Layout, Spin } from 'antd'
import { MapMarkerTagsIcons, MapMarkerTagsIconsContext } from '../../contexts'
import { SidebarConfigs } from '../../dtos/MapPageConfigs'
import { convertQueryParamToArray } from '../../utils/utils'
import RouterQueryInitializer from '../../components/RouterQueryInitializer'
import { TagsCount } from '../../dtos/TagCount'
import Sidebar from '../../components/Sidebar'
import { MapColorModes } from '../../components/MapColorStyle'
import { getConfigFile } from '../api/v0/maps/[project]/config'
import MapLocationProps from '../../dtos/MapLocationProps'
import getTagsIcons from '../../utils/icons'


const { Content } = Layout

interface MapPageProps {
  popularTags: TagsCount
  mapLocationProps: MapLocationProps
  sidebarConfigs: SidebarConfigs
  initMapColorStyle: MapColorModes
  mapMarkerTagsIcons: MapMarkerTagsIcons
}

const MapPage: FC<MapPageProps> = (props) => {
  const { mapLocationProps, sidebarConfigs, initMapColorStyle, mapMarkerTagsIcons } = props

  const [isLoading, { setRight: setNotLoading }] = useToggle(true)

  const Map = useMemo(
    () =>
      dynamic(
        () =>
          import('../../components/Map').then((mod) => {
            setNotLoading()
            return mod.default
          }),
        {
          ssr: false,
        },
      ),
    [],
  )

  return (
    <Fragment>
      <RouterQueryInitializer
        initMapLocationProps={mapLocationProps}
        initMapColorStyle={initMapColorStyle}
      />

      <Sidebar {...sidebarConfigs} />

      <Content>
        <Spin spinning={isLoading}>
          <div id="map">
            <MapMarkerTagsIconsContext.Provider value={mapMarkerTagsIcons}>
              <Map
                lat={mapLocationProps.lat}
                lng={mapLocationProps.lng}
                zoom={mapLocationProps.zoom}
              />
            </MapMarkerTagsIconsContext.Provider>
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

  const pageConfigs = getConfigFile(project as string)

  const mapLocationProps = pageConfigs.map.location
  const sidebarConfigs = pageConfigs.sidebar
  const initMapColorStyle = pageConfigs.map.colorStyle
  const mapMarkerTagsIcons = getTagsIcons(project)

  const props = {
    mapLocationProps,
    sidebarConfigs,
    initMapColorStyle,
    mapMarkerTagsIcons,
  }

  // todo: move the re-validate value to constants
  return {
    props,
  }
}

export default MapPage

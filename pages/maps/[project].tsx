import { FC, useEffect, useMemo } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useToggle } from 'ahooks'
import qs from 'qs'

import { AxiosInstance } from '../../api'
import API_ENDPOINTS from '../../api/endpoints'
import {
  convertQueryParamToFloat,
  convertQueryParamToString,
  removeDynamicRoutingParams,
  updateRoutingParams
} from '../../utils/utils'

import { Layout, Spin } from 'antd'
import ResultList from '../../components/ResultList'
import Filters from '../../components/Filters'
import NavSidebar from '../../components/NavSidebar'
import SearchInput from '../../components/SearchInput'
import { MapLocationProps } from '../../components/Map'

import MAP_CONSTANTS from '../../consts/map'
import MapPageConfigs from './types'

const { Content, Sider } = Layout


interface MapPageProps {
  popularTags: string[]
  mapLocationProps: MapLocationProps
}

const MapPage: FC<MapPageProps> = (props) => {
  const { mapLocationProps } = props

  const router = useRouter()
  const { query } = router

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

  useEffect(() => {
    // all of that is to set the default URL query params
    // todo: make it a function because of readability and more params may come in the future
    const { lat: latParam, lng: lngParam, zoom: zoomParam, project } = query
    // coming from the dynamic routing. we should not add them as the query params
    const dynamicRouteParams = ['project']
    const lat: string = latParam ?
      convertQueryParamToFloat(latParam).toPrecision(MAP_CONSTANTS.precisions.lat) :
      mapLocationProps.lat.toPrecision(MAP_CONSTANTS.precisions.lat)
    const lng: string = lngParam ?
      convertQueryParamToFloat(lngParam).toPrecision(MAP_CONSTANTS.precisions.lng) :
      mapLocationProps.lng.toPrecision(MAP_CONSTANTS.precisions.lng)
    const zoom: string = zoomParam ?
      convertQueryParamToFloat(zoomParam).toPrecision(MAP_CONSTANTS.precisions.zoom) :
      mapLocationProps.zoom.toPrecision(MAP_CONSTANTS.precisions.zoom)
    const paramsToUpdate = {lat, lng, zoom}

    // filter query params out of all params including the dynamic ones
    let newQueryParams = updateRoutingParams(query, paramsToUpdate)
    newQueryParams = removeDynamicRoutingParams(newQueryParams, dynamicRouteParams)


    //todo: how about having other params like fixedTags but not zoom or things like that
    router.replace(
      `/maps/${project}?${qs.stringify(newQueryParams, { arrayFormat: 'repeat' })}`,
      undefined,
      { shallow: true },
    )
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
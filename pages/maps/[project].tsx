import { FC, Fragment, useMemo } from 'react'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { useToggle } from 'ahooks'

import { Layout, Spin } from 'antd'

import { AxiosInstance } from '../../api'
import MapPageConfigs from '../../dtos/MapPageConfigs'
import API_ENDPOINTS from '../../api/endpoints'
import { convertQueryParamToString } from '../../utils/utils'

import ResultList from '../../components/ResultList'
import Filters from '../../components/Filters'
import NavSidebar from '../../components/NavSidebar'
import SearchInput from '../../components/SearchInput'
import RouterQueryInitializer from '../../components/RouterQueryInitializer'

import { MapLocationProps } from '../../components/Map'
import { TagsCount } from '../../dtos/TagCount'
import PopularTagsRequest from '../../dtos/PopularTagsRequest'

const { Content, Sider } = Layout


interface MapPageProps {
  popularTags: TagsCount
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
          theme="light"
          collapsible
          collapsed={isSideBarCollapsed}
          onCollapse={toggleIsSideBarCollapsed}
          width="52vw"
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

          <Filters
            tagsCount={props.popularTags}
          />

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


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { project } = ctx.params

  // set configs
  const pageConfigsReq = await AxiosInstance.GetRequest<MapPageConfigs>(
    API_ENDPOINTS.getMapPageConfigs(
      convertQueryParamToString(project),
    ),
  )

  const pageConfigs = AxiosInstance.GetSuccessData(pageConfigsReq)
  const mapLocationProps = pageConfigs.map.location

  // get popular tags
  const popularTagsRequestParams: PopularTagsRequest = {
    min_count: pageConfigs.popularTags.min_count,
    max_count: pageConfigs.popularTags.max_count,
    limit: pageConfigs.popularTags.limit,
    offset: pageConfigs.popularTags.offset,
  }
  const popularTagsReq = await AxiosInstance.GetRequest<TagsCount>(
    API_ENDPOINTS.getPopularTags(),
    {
      params: popularTagsRequestParams
    }
  )
  const popularTags = AxiosInstance.GetSuccessData(popularTagsReq)

  //todo: move the re-validate value to constants
  return {
    props: {
      mapLocationProps,
      popularTags
    },
  }
}

export default MapPage
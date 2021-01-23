import {useMemo} from 'react'
import dynamic from 'next/dynamic'
import {useToggle} from 'ahooks'

import {Layout} from 'antd'

const {Content, Sider} = Layout

import Complete from '../../components/AutoComplete'
import TypeChooser from '../../components/TypeChooser'
import SearchTags from '../../components/SearchTags'
import ResultList from '../../components/ResultList'


const MapPage = () => {
  const Map = useMemo(() => dynamic(
    () => import('../../components/map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  const [isSideBarCollapsed, {toggle: toggleIsSideBarCollapsed}] = useToggle()

  return (
    <Layout
      hasSider
    >
      <Sider
        theme="light"
        collapsible
        collapsed={isSideBarCollapsed}
        onCollapse={toggleIsSideBarCollapsed}
        width="68vh"
      >
        <Complete/>
        <TypeChooser/>
        <SearchTags/>
        <div
          style={{height: '60vh'}}
        >
          <ResultList/>
        </div>
      </Sider>
      <Content>
        <Map/>
      </Content>
    </Layout>
  )
}


export default MapPage
import {FC, useMemo} from 'react'
// import {GetStaticPaths, GetStaticProps} from 'next'
import dynamic from 'next/dynamic'
// import axios from 'axios'
import {useToggle} from 'ahooks'

import {Layout, Spin} from 'antd'

const {Content, Sider} = Layout


import ResultList from '../../components/ResultList'
import Filters from '../../components/Filters'
import NavSidebar from '../../components/NavSidebar'
import SearchInput from '../../components/SearchInput'


interface MapPageProps {
  popularTags: string[]
}


const MapPage: FC<MapPageProps> = (_props) => {
  const Map = useMemo(() => dynamic(
    () => import('../../components/map'),
    {
      loading: () => <Spin/>,
      ssr: false
    }
  ), [])

  // const {popularTags} = props
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
        width="48vw"
        trigger={null}
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >

        {/*todo: create a background of dark with bottom shadow*/}
        <NavSidebar/>

        {/*todo: make the search component a separate component to prevent unnecessary renders*/}
        <SearchInput/>

        <Filters/>

        <div style={{flexGrow: 1}}>
          <ResultList/>
        </div>

      </Sider>
      <Content>
        <div id="map">
          <Map/>
        </div>
      </Content>
    </Layout>
  )
}


// export const getStaticProps: GetStaticProps = async (ctx) => {
//   let popularTags = []
//   try {
//     const response = await axios.get(`https://api.ofdb.io/v0/tags`)
//     popularTags = response.data
//   } catch (e) {
//     console.error(e)
//   }
//
//   return {
//     props: {
//       popularTags
//     }
//   }
// }

// export const getStaticPaths: GetStaticPaths = async (ctx) => {
//   return {
//     paths: [
//       {params: {project: 'kvm'}}
//     ],
//     fallback: false
//   }
// }


export default MapPage
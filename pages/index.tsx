import { FC } from 'react'
import { Layout } from 'antd'
import HomeHeader from '../components/HomeHeader'
import HomeBanner from '../components/HomeBanner'
import HomeContent from '../components/HomeContent'


const Home: FC = () => {
  return (
    <Layout>

      <HomeHeader/>

      <HomeBanner/>

      <HomeContent/>

    </Layout>
  )
}


export default Home
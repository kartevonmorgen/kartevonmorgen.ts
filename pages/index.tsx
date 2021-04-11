import { FC } from 'react'
import { Layout } from 'antd'
import HomeHeader from '../components/HomeHeader'
import HomeContent from '../components/HomeContent'


const Home: FC = () => {
  return (
    <Layout>

      <HomeHeader/>

      <HomeContent/>

    </Layout>
  )
}


export default Home
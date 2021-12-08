import { FC } from 'react'
import { Layout } from 'antd'
import HomeHeader from '../components/HomeHeader'
import Banner from '../components/Banner'
import HomeContent from '../components/HomeContent'
import HomeDivider from '../components/HomeDivider'
import Team from '../components/Team'
import HomeEntityRedirector from '../components/HomeEntityRedirector'
import Tutorial from '../components/Tutorial'
import Vision from '../components/Vision'
import Creators from '../components/Creators'
import Partners from '../components/Partners'
import Footer from '../components/HomeFooter'


const { Content } = Layout

const Home: FC = () => (
  <div>
    <HomeEntityRedirector/>

    <Layout>

      <HomeHeader/>

      <Banner/>

      <Content
        style={{
          backgroundColor: 'white',
          padding: 60,
          paddingTop: 24,
        }}
      >
        <HomeContent/>

        <HomeDivider/>

        <Tutorial/>

        <Vision/>

        <HomeDivider/>

        <Team/>

        <HomeDivider/>

        <Creators/>

        <HomeDivider/>

        <Partners/>

      </Content>

      <Footer/>

    </Layout>
  </div>
)


export default Home

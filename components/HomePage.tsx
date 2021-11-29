import { FC } from 'react'
import { Layout } from 'antd'
import HomeHeader from './HomeHeader'
import Banner from './Banner'
import HomeContent from './HomeContent'
import HomeDivider from './HomeDivider'
import Team from './Team'
import HomeEntityRedirector from './HomeEntityRedirector'
import Tutorial from './Tutorial'
import Vision from './Vision'
import Creators from './Creators'
import Partners from './Partners'
import Footer from './HomeFooter'

const { Content } = Layout

const HomePage: FC = () => {
  return (
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
}


export default HomePage
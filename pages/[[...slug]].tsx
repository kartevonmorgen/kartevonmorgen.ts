import { FC } from 'react'
import { Layout } from 'antd'
import HomeHeader from '../components/HomeHeader'
import HomeBanner from '../components/HomeBanner'
import HomeContent from '../components/HomeContent'
import HomeDivider from '../components/HomeDivider'
import Team from '../components/Team'
import HomeEntityRedirector from '../components/HomeEntityRedirector'

const { Content } = Layout

const Home: FC = () => {
  return (
    <div>
      <HomeEntityRedirector/>

      <Layout>

        <HomeHeader/>

        <HomeBanner/>

        <Content
          style={{
            backgroundColor: 'white',
            padding: 124,
            paddingTop: 24,
          }}
        >
          <HomeContent/>

          <HomeDivider/>

          <Team/>

        </Content>

      </Layout>
    </div>
  )
}


export default Home
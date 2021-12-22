import { FC } from 'react'
import DynamicHomePage from '../dynamic-components/HomePage'


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

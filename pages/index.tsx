import { FC } from 'react'
import Image from 'next/image'
import { Col, Layout, Menu, Row, Typography } from 'antd'


const { Header, Content, Footer } = Layout
const { Link } = Typography
const { SubMenu, Item } = Menu


const Home: FC = () => {
  return (
    <Layout>

      <Header
        style={{
          boxShadow: '0 2px 8px #f0f1f2',
          backgroundColor: 'white',
        }}
      >
        <Row
          justify="space-between"
        >
          <Col>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <Image
                src="/assets/img/logo.png"
                alt="logo"
                layout="intrinsic"
                width={97}
                height={40}
              />
            </div>
          </Col>

          <Col>
            <Menu
              mode="horizontal"
            >
              <Menu.Item>Map</Menu.Item>
              <Menu.Item>About</Menu.Item>
              <Menu.Item>Contact</Menu.Item>
              <Menu.Item>Donate</Menu.Item>
              <Menu.Item>Login</Menu.Item>
            </Menu>
          </Col>
        </Row>
      </Header>

      <Content>Content</Content>

      <Footer>Footer</Footer>

    </Layout>
  )
}


export default Home
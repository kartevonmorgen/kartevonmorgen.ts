import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Col, Layout, Menu, Row } from 'antd'
import { GlobalOutlined } from '@ant-design/icons/lib'


const { Header } = Layout


const HomeHeader: FC = () => {
  return (
    <Header
      style={{
        boxShadow: '0 2px 8px #f0f1f2',
        backgroundColor: 'white',
        height: 68,
      }}
    >
      <Row
        justify="space-between"
      >
        <Col
          xs={2}
          sm={4}
        >
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
            <Menu.Item><Link href={'/maps/main'}>Map</Link></Menu.Item>
            <Menu.Item><Link href="https://blog.vonmorgen.org/">About</Link></Menu.Item>
            <Menu.Item><Link href={'/contact'}>Contact</Link></Menu.Item>
            <Menu.Item><Link href="https://blog.vonmorgen.org/spenden">Donate</Link></Menu.Item>
            <Menu.Item><Link href={'/login'}>Login</Link></Menu.Item>
            <Menu.SubMenu
              icon={<GlobalOutlined/>}
              title="Language"
            >
              <Menu.Item><Link href={'/'} locale="en">en</Link></Menu.Item>
              <Menu.Item><Link href={'/'} locale="de">de</Link></Menu.Item>
              <Menu.Item><Link href={'/'} locale="es">es</Link></Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Col>
      </Row>
    </Header>
  )
}


export default HomeHeader
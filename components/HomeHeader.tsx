import { FC } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import { Col, Layout, Menu, Row } from 'antd'
import GlobalOutlined from '@ant-design/icons/lib/icons/GlobalOutlined'


const { Header } = Layout


const HomeHeader: FC = () => {
  const router = useRouter()
  const { locales } = router
  const { t } = useTranslation('home')

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
              src="/assets/img/logo.webp"
              alt="logo"
              layout="intrinsic"
              width={64}
              height={40}
            />
          </div>
        </Col>

        <Col>
          <Menu
            mode="horizontal"
          >
            <Menu.Item key="home-header-menu-item-map">
              <Link href={'/m/main'}>{t('landingPage.menu.map')}</Link>
            </Menu.Item>

            <Menu.Item key="home-header-menu-item-infos">
              <Link href="https://blog.vonmorgen.org/">{t('landingPage.menu.infos')}</Link>
            </Menu.Item>

            <Menu.Item key="home-header-menu-item-contact">
              <Link href={'/contact'}>{t('landingPage.menu.contact')}</Link>
            </Menu.Item>

            <Menu.Item key="home-header-menu-item-donate">
              <Link href="https://blog.vonmorgen.org/spenden">{t('landingPage.menu.donate')}</Link>
            </Menu.Item>

            <Menu.Item key="home-header-menu-item-login">
              <Link href={'/login'}>{t('landingPage.menu.login')}</Link>
            </Menu.Item>

            <Menu.SubMenu
              icon={<GlobalOutlined/>}
              title="Language"
              key="home-header-sub-menu-locales"
            >
              {
                locales.map((locale) => (
                  <Menu.Item key={`locale-${locale}`}>
                    <Link href={'/'} locale={locale}>{locale}</Link>
                  </Menu.Item>
                ))
              }
            </Menu.SubMenu>
          </Menu>
        </Col>
      </Row>
    </Header>
  )
}


export default HomeHeader

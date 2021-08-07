import { FC, MouseEvent } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { Col, Layout, Row, Typography } from 'antd'
import HomeCitySearch from './HomeCitySearch'
import { NextRouter, useRouter } from 'next/router'

const { Content } = Layout
const { Title } = Typography

const openMapByClickingOnTheBackground = (router: NextRouter) => (e: MouseEvent<HTMLDivElement>) => {
  if (e.currentTarget === e.target) {
    router.push('/maps/main')
  }
}

const Banner: FC = () => {

  const { t } = useTranslation('home')

  const router = useRouter()


  return (
    <Content>
      <div
        id='main-cover'
        style={{
          height: 'calc(100vh - 68px)',
          width: '100%',
          backgroundColor: 'indianRed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={openMapByClickingOnTheBackground(router)}
      >
        <Row style={{
          display: 'inline-block',
        }}>
          <Col xs={24} style={{ textAlign: 'center' }}>
            <Title
              level={1}
              style={{
                color: 'white',
              }}
            >
              {t('landingPage.slogan')}
            </Title>
          </Col>
          <Col xs={24} style={{ textAlign: 'center' }}>
            <HomeCitySearch />
          </Col>
        </Row>
      </div>
    </Content>
  )
}

export default Banner
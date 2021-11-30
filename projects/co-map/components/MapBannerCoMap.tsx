import React, { FC, MouseEvent } from 'react'
import { Col, Layout, Row, Typography } from 'antd'
import { NextRouter, useRouter } from 'next/router'
import HomeCitySearchCoMap from './HomeCitySearchCoMap'


const { Content } = Layout
const { Title } = Typography

const openMapByClickingOnTheBackground = (router: NextRouter) => (e: MouseEvent<HTMLDivElement>) => {
  if (e.currentTarget === e.target) {
    router.push('/m/co-map')
  }
}

const MapBannerCoMap: FC = () => {

  const router = useRouter()
  return (<Content>
      <div
        // id='main-cover'
        className={'map-banner'}
        onClick={openMapByClickingOnTheBackground(router)}
      >
        <Row style={{ marginBottom: '100px' }}>
          <Col xs={24} style={{ textAlign: 'center' }}>
            <Title
              level={1}
              style={{
                color: 'white',
              }}
            >
              <span>Карта устойчивых проектов России</span>
            </Title>
            <Title
              level={5}
              style={{
                color: 'white',
                margin: '20px 0px',
                padding: '0px',
              }}
            >
              <span>c открытыми данными и открытым исходным кодом</span>
            </Title>

          </Col>
          <Col xs={24} style={{ textAlign: 'center' }}>
            <HomeCitySearchCoMap/>
          </Col>
        </Row>
      </div>
    </Content>
  )
}

export default MapBannerCoMap
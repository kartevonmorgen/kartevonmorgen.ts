import { FC } from 'react'
import { Col, Layout, Row, Typography } from 'antd'
import HomeCitySearch from './HomeCitySearch'

const { Content } = Layout
const { Title } = Typography


const HomeContent: FC = () => {
  return (
    <Content>
      <div
        id="main-cover"
        style={{
          height: 'calc(100vh - 68px)',
          width: '100%',
          backgroundColor: 'indianRed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/*<div*/}
        {/*  style={{*/}
        {/*    width: '100%',*/}
        {/*  }}*/}
        {/*>*/}

        <Row>
          <Col xs={24} style={{ textAlign: 'center' }}>
            <Title
              level={1}
              style={{
                color: 'white',
              }}
            >
              Mapping for Good
            </Title>
          </Col>
          <Col xs={24} style={{ textAlign: 'center' }}><HomeCitySearch/></Col>
        </Row>
        {/*</div>*/}
      </div>
    </Content>
  )
}

export default HomeContent
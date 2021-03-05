import React, { FC, Fragment } from 'react'
import { Col, Divider, Layout, Row, Typography } from 'antd'
import moment from 'moment'
// import { API_ENDPOINTS } from '../api/endpoints'


const { Footer } = Layout
const { Link, Text } = Typography


interface EntityFooterProps {
  created_at?: number
  version?: number
}


const EntityFooter: FC<EntityFooterProps> = (props) => {
  const { created_at, version } = props

  return (
    <Footer
      style={{
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 8,
        paddingBottom: 8,
        marginLeft: -4,
        marginRight: -4,
      }}
    >
      <Row
        justify="space-between"
      >
        <Col>
          <Link
            style={{
              fontSize: '0.8em',
            }}
          >
            Report this entity
          </Link>
        </Col>

        <Col>
          <Text
            type="secondary"
            style={{
              fontSize: '0.8em',
            }}
          >
            last edit {moment.unix(created_at).fromNow()}
          </Text>

          {
            version && (
              <Fragment>
                <Divider type="vertical"/>
                <Text
                  type="secondary"
                  style={{
                    fontSize: '0.8em',
                  }}
                >
                  {version}
                </Text>
              </Fragment>
            )
          }
        </Col>
      </Row>

      <Link
        style={{
          fontSize: '0.8em',
        }}
      >
        View history or archive this entity
      </Link>
    </Footer>
  )
}


export default EntityFooter
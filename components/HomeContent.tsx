import { FC } from 'react'
import Image from 'next/image'
import { Col, Layout, Row, Typography } from 'antd'

const { Content } = Layout
const { Title, Text, Paragraph } = Typography


const HomeContent: FC = () => {
  return (
    <div>
      <Title
        level={1}
        style={{
          textAlign: 'center',
        }}
      >
        The world is full of explorers, and full of things to be explored.
      </Title>

      <Row
        justify="center"
        align="middle"
      >
        <Col>
          <Image
            src="/assets/img/lp_illu1.webp"
            layout="fixed"
            width={370}
            height={400}
            alt="discover the map"
          />
        </Col>

        <Col md={8}>
          <Title
            level={2}
            style={{
              textAlign: 'center',
            }}
          >
            Discover places from an inspiring point of view.
          </Title>

          <Paragraph
            strong
            style={{
              textAlign: 'center',
            }}
          >
            Our map invites you to explore forward-thinking projects, companies and soon to come events in your area.
          </Paragraph>

        </Col>
      </Row>

      <Row
        justify="center"
        align="middle"
      >
        <Col>
          <Image
            src="/assets/img/lp_illu2.webp"
            layout="fixed"
            width={606}
            height={400}
            alt="be part of that"
          />
        </Col>

        <Col md={8}>
          <Title
            level={2}
            style={{
              textAlign: 'center',
            }}
          >
            Be a part of it!
          </Title>

          <Paragraph
            strong
            style={{
              textAlign: 'center',
            }}
          >
            Find all the information you need to get in touch with projects you want to engage with. Stop by to say
            Hello!
          </Paragraph>

        </Col>
      </Row>

      <Row
        justify="center"
        align="middle"
      >
        <Col>
          <Image
            src="/assets/img/lp_illu3.webp"
            layout="fixed"
            width={586}
            height={400}
            alt="Let’s create a world"
          />
        </Col>

        <Col md={8}>
          <Title
            level={2}
            style={{
              textAlign: 'center',
            }}
          >
            Let’s create a world for tomorrow
          </Title>

          <Paragraph
            strong
            style={{
              textAlign: 'center',
            }}
          >
            Together, we want to show and embrace the positive change in our society.
          </Paragraph>

        </Col>
      </Row>
    </div>
  )
}


export default HomeContent
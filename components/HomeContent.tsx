import { FC } from 'react'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import { Col, Row, Typography } from 'antd'

const { Title, Paragraph } = Typography


const HomeContent: FC = () => {
  const { t } = useTranslation('home')

  return (
    <div>
      <Title
        level={1}
        style={{
          textAlign: 'center',
        }}
      >
        {t('landingExplain.chapter1.heading')}
      </Title>

      <Row
        justify="center"
        align="middle"
      >
        <Col sm={24} md={8}>
          <Title
            level={2}
            style={{
              textAlign: 'center',
            }}
          >
            {t('landingExplain.chapter1.paragraph1.heading')}
          </Title>

          <Paragraph
            strong
            style={{
              textAlign: 'center',
            }}
          >
            {t('landingExplain.chapter1.paragraph1.text')}
          </Paragraph>

        </Col>

        <Col>
          <Image
            src="/assets/img/lp_illu1.webp"
            layout="intrinsic"
            width={370}
            height={400}
            alt="discover the map"
          />
        </Col>
      </Row>

      <Row
        justify="center"
        align="middle"
      >
        <Col sm={24} md={8}>
          <Title
            level={2}
            style={{
              textAlign: 'center',
            }}
          >
            {t('landingExplain.chapter1.paragraph2.heading')}
          </Title>

          <Paragraph
            strong
            style={{
              textAlign: 'center',
            }}
          >
            {t('landingExplain.chapter1.paragraph2.text')}
          </Paragraph>
        </Col>

        <Col>
          <Image
            src="/assets/img/lp_illu2.webp"
            layout="intrinsic"
            width={606}
            height={400}
            alt="be part of that"
          />
        </Col>
      </Row>

      <Row
        justify="center"
        align="middle"
      >
        <Col sm={24} md={8}>
          <Title
            level={2}
            style={{
              textAlign: 'center',
            }}
          >
            {t('landingExplain.chapter1.paragraph3.heading')}
          </Title>

          <Paragraph
            strong
            style={{
              textAlign: 'center',
            }}
          >
            {t('landingExplain.chapter1.paragraph3.text')}
          </Paragraph>
        </Col>

        <Col>
          <Image
            src="/assets/img/lp_illu3.webp"
            layout="intrinsic"
            width={586}
            height={400}
            alt="Let’s create a world"
          />
        </Col>
      </Row>
    </div>
  )
}


export default HomeContent

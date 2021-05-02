import { FC } from 'react'
import Image from 'next/image'
import { Space, Typography } from 'antd'


const { Title, Paragraph } = Typography


interface Partner {
  src: string
  width: number
  height: number
  alt: string
  link: string
}

const partners: Partner[] = [
  {
    src: 'BMZ.webp',
    width: 300,
    height: 100,
    alt: 'BMZ',
    link: 'http://www.bmz.de/',
  },
  {
    src: 'EngagementGlobal.webp',
    width: 300,
    height: 100,
    alt: 'Engagement Global',
    link: 'https://www.engagement-global.de/rueckkehrende.html',
  },
  {
    src: 'mannheim.webp',
    width: 300,
    height: 100,
    alt: 'mannheim',
    link: 'https://www.mannheim.de/',
  },
]

const Partners: FC = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <Space
      align="center"
      direction="vertical"
      style={{
        justifyContent: 'center',
      }}
      size="large"
    >
      <Title style={{ textAlign: 'center' }}>Our Partners</Title>

      <Space
        align="center"
        wrap
        style={{
          justifyContent: 'center',
        }}
        size="large"
      >
        {
          partners.map(({ src, width, height, alt, link }, i) => (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              key={`creator-${i}`}
            >
              <Image
                src={`/assets/img/partners/${src}`}
                layout="intrinsic"
                width={width}
                height={height}
              />
            </a>
          ))
        }
      </Space>

      <Paragraph
        style={{
          textAlign: 'center',
        }}
        strong
      >
        In its pilot phase this project has been supported by the Heinrich-Böll-Foundation.
      </Paragraph>

    </Space>
  </div>
)


export default Partners
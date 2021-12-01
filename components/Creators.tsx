import { FC } from 'react'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import { Space, Typography } from 'antd'


const { Title } = Typography


interface Creator {
  src: string
  width: number
  height: number
  alt: string
  link: string
}

const creators: Creator[] = [
  {
    src: 'ideen.webp',
    width: 400,
    height: 130,
    alt: 'ideen',
    link: 'http://www.ideenhochdrei.org/de/',
  },
  {
    src: 'slowtec.webp',
    width: 490,
    height: 130,
    alt: 'slowtech',
    link: 'http://slowtec.de/',
  },
]

const Creators: FC = () => {
  const { t } = useTranslation('home')

  return (
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
      >
        <Title style={{ textAlign: 'center' }}>{t('landingExplain.chapter6.heading')}</Title>

        <Space
          align="center"
          wrap
          style={{
            justifyContent: 'center',
          }}
          size="large"
        >
          {
            creators.map(({ src, width, height, alt, link }, i) => (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                key={`creator-${i}`}
              >
                <Image
                  src={`/assets/img/creators/${src}`}
                  layout="intrinsic"
                  width={width}
                  height={height}
                />
              </a>
            ))
          }
        </Space>
      </Space>
    </div>
  )
}

export default Creators

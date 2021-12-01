import { FC } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { Space, Typography } from 'antd'
import Image from 'next/image'


const { Title } = Typography


interface Tutorial {
  src: string
  width: number
  height: number
  alt: string
}

const tutorials: Tutorial[] = [
  {
    src: '1.webp',
    width: 1211,
    height: 599,
    alt: 'type in the search bar',
  },
  {
    src: '2.webp',
    width: 1211,
    height: 599,
    alt: 'filter your category',
  },
  {
    src: '3.webp',
    width: 1211,
    height: 599,
    alt: 'view the detail of your entry',
  },
  {
    src: '4.webp',
    width: 1211,
    height: 737,
    alt: 'edit the entry you want',
  },
  {
    src: '5.webp',
    width: 1211,
    height: 599,
    alt: 'create a new entry',
  },
  {
    src: '6.webp',
    width: 1211,
    height: 1014,
    alt: 'create a network',
  },
]

const HomeTutorial: FC = () => {
  const { t } = useTranslation('home')

  return (
    <div>
      <Space direction="vertical" style={{ justifyContent: 'center' }}>
        <Title
          level={1}
          style={{
            textAlign: 'center',
          }}
        >
          {t('landingExplain.chapter2.heading')}
        </Title>

        {
          tutorials.map(({ src, width, height, alt }, i) => (
            <Image
              key={`tutorial-image-${i}`}
              src={`/assets/img/tutorial/${src}`}
              layout="intrinsic"
              width={width}
              height={height}
              alt={alt}
            />
          ))
        }
      </Space>
    </div>
  )
}


export default HomeTutorial

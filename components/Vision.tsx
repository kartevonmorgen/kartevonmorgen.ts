import { FC } from 'react'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import { Typography } from 'antd'


const { Title, Paragraph } = Typography


const Vision: FC = (_props) => {
  const { t } = useTranslation('home')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Title
        style={{
          textAlign: 'center',
        }}
      >
        {t('landingExplain.chapter3.heading')}
      </Title>

      <Paragraph
        style={{
          textAlign: 'center',
        }}
      >
        {t('landingExplain.chapter3.text.1')}
      </Paragraph>

      <Paragraph
        style={{
          textAlign: 'center',
        }}
      >
        {t('landingExplain.chapter3.text.2')}
      </Paragraph>

      <Image
        src="/assets/img/postkarte.webp"
        layout="intrinsic"
        width={1000}
        height={450}
        alt="post card"
      />
    </div>
  )
}

export default Vision

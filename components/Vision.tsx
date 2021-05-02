import { FC } from 'react'
import Image from 'next/image'
import { Typography } from 'antd'


const { Title, Paragraph } = Typography


const Vision: FC = () => (
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
      We have a vision
    </Title>

    <Paragraph
      style={{
        textAlign: 'center',
      }}
    >
      von morgen supports creativity, sustainability and joint action.
    </Paragraph>

    <Paragraph
      style={{
        textAlign: 'center',
      }}
    >
      We believe in a modern society in which we all can embrace a self-determined, content and
      environmental-friendly life. Our goal: a benevolent future.
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


export default Vision
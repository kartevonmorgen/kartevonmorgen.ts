import { FC } from 'react'
import { Layout, Space, Typography } from 'antd'


const { Footer } = Layout
const { Text, Link } = Typography


const HomeFooter: FC = () => (
  <Footer
    style={{
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <Space
      align="center"
      direction="vertical"
    >
      <Text strong>Tomorrow starts today.</Text>

      <div>
        <Text>Contact:&nbsp;</Text>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="mailto:info@kartevonmorgen.org"
        >
          info@kartevonmorgen.org
        </Link>
      </div>
      <div>
        <Text>Social Media:&nbsp;</Text>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://facebook.com/vonmorgen"
        >
          facebook.com/vonmorgen
        </Link>
      </div>
      <div>
        <Text>Open Source:&nbsp;</Text>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/kartevonmorgen/"
        >
          github.com/kartevonmorgen/
        </Link>
      </div>
    </Space>
  </Footer>
)


export default HomeFooter

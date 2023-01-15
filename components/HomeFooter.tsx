import { FC } from 'react'
import { Layout, Space, Typography } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'


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
      align='center'
      direction='vertical'
    >
      <Text strong>Tomorrow starts today.</Text>

      <Space>
        <FontAwesomeIcon icon='envelope' />
        <div>
          <Text className='ml-8'>Contact:&nbsp;</Text>
          <Link
            target='_blank'
            rel='noopener noreferrer'
            href='mailto:info@kartevonmorgen.org'
          >
            info@kartevonmorgen.org
          </Link>
        </div>
      </Space>

      <Space>
        <FontAwesomeIcon icon={['fab', 'telegram']} />
        <div>
          <Text>Telegram:&nbsp;</Text>
          <Link
            target='_blank'
            rel='noopener noreferrer'
            href='https://t.me/vonmorgen'
          >
            /vonmorgen
          </Link>
        </div>
      </Space>

      <Space>
        <FontAwesomeIcon icon={['fab', 'twitter']} />
        <div>
          <Text>Twitter:&nbsp;</Text>
          <Link
            target='_blank'
            rel='noopener noreferrer'
            href='https://twitter.com/kartevonmorgen'
          >
            /kartevonmorgen
          </Link>
        </div>
      </Space>

      <Space>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Image
            src="/icons/we.webp"
            alt="logo"
            layout="fixed"
            width={24}
            height={24}
          />
        </div>
        <div>
          <Text>WeChange:&nbsp;</Text>
          <Link
            target='_blank'
            rel='noopener noreferrer'
            href='https://wechange.de/project/karte-von-morgen-in-allen-unistadten'
          >
            /karte-von-morgen
          </Link>
        </div>
      </Space>

      <Space>
        <FontAwesomeIcon icon={['fab', 'facebook']} />
        <div>
          <Text>Facebook:&nbsp;</Text>
          <Link
            target='_blank'
            rel='noopener noreferrer'
            href='https://facebook.com/vonmorgen'
          >
            /vonmorgen
          </Link>
        </div>
      </Space>

      <Space>
        <FontAwesomeIcon icon={['fab', 'github']} />
        <div>
          <Text>Open Source:&nbsp;</Text>
          <Link
            target='_blank'
            rel='noopener noreferrer'
            href='https://github.com/kartevonmorgen/'
          >
            /kartevonmorgen
          </Link>
        </div>
      </Space>

    </Space>
  </Footer>
)


export default HomeFooter

import { FC } from 'react'
import { AppProps } from 'next/app'
import { ConfigProvider } from 'antd'
import '../styles/globals.css'
import 'typeface-rubik/index.css'


const MyApp: FC<AppProps> = ({ Component, pageProps }) => (
       <ConfigProvider
          theme={{
            token: {
              fontFamily: '"Rubik", sans-serif',
            }
          }}
      >
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </ConfigProvider>
)

export default MyApp

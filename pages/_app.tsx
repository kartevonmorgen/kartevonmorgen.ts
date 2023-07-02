import { FC } from 'react'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import store from '../store'
import '../utils/icons/font-awesome'
import Layout from '../components/Layout'
import GlobalLocale from '../components/GlobalLocale'
import '../styles/globals.css'
import 'typeface-rubik/index.css'


const MyApp: FC<AppProps> = ({ Component, pageProps }) => (
  <Layout project={pageProps.project}>
    <GlobalLocale/>

    <Provider store={store}>
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
    </Provider>
  </Layout>
)

export default MyApp

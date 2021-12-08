import { FC } from 'react'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../store'
import '../utils/icons/font-awesome'
import Layout from '../components/Layout'
import GlobalLocale from '../components/GlobalLocale'
import 'antd/dist/antd.min.css'
import '../styles/globals.css'


const MyApp: FC<AppProps> = ({ Component, pageProps }) => (
  <Layout project={pageProps.project}>
    <Provider store={store}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </Provider>

    <GlobalLocale/>
  </Layout>
)

export default MyApp

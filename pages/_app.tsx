import { FC } from 'react'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../store'
import '../utils/icons/font-awesome'
import Layout from '../components/Layout'
import GlobalLocale from '../components/GlobalLocale'
import '../styles/globals.css'


const MyApp: FC<AppProps> = ({ Component, pageProps }) => (
  <Layout project={pageProps.project}>
    <GlobalLocale/>

    <Provider store={store}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </Provider>
  </Layout>
)

export default MyApp

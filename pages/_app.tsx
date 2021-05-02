import { FC } from 'react'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../store'
import '../utils/icons/font-awesome'
import Layout from '../components/Layout'
import GlobalLocale from '../components/GlobalLocale'

// it's not a mistake. because we benefit from the next-plugin-antd-less
// the less files should be imported with require
require('../styles/globals.less')


const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Layout project={pageProps.project}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>

      <GlobalLocale/>
    </Layout>
  )
}

export default MyApp
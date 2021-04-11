import { FC } from 'react'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../store'
import '../utils/icons/font-awesome'
import '../styles/globals.less'
import Layout from '../components/Layout'
import GlobalLocale from '../components/GlobalLocale'


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
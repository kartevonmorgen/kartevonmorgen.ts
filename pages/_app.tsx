import { FC } from 'react'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../store'
import '../utils/icons/font-awesome'
import Layout from '../components/Layout'
import GlobalLocale from '../components/GlobalLocale'
import 'antd/dist/antd.min.css'
import '../styles/globals.scss'


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

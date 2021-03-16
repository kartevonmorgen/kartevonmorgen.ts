import { FC } from 'react'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../store'
import '../utils/icons/font-awesome'
import '../styles/globals.css'
import 'antd/dist/antd.css'
import Layout from '../components/Layout'


const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Layout project={pageProps.project}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </Layout>
  )
}

export default MyApp
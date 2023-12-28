import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {Provider} from 'react-redux'
import get from 'lodash/get'
import withTheme from '../theme'
import Layout from '../components/Layout'
import GlobalLocale from '../components/GlobalLocale'
import store from '../store'
import '../utils/icons/font-awesome'


export default function App({Component, pageProps}: AppProps) {
  return withTheme(
    <Layout project={get(pageProps, 'project', undefined)}>
      <GlobalLocale/>

      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </Layout>,
  )
}

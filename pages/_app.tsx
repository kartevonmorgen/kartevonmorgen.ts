import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {Provider} from 'react-redux'
import get from 'lodash/get'
import { useEffect } from 'react'
import withTheme from '../theme'
import Layout from '../components/Layout'
import GlobalLocale from '../components/GlobalLocale'
import store from '../store'
import '../utils/icons/font-awesome'
import { initViewportHeight, cleanupViewportHeight } from '../utils/viewport'


export default function App({Component, pageProps}: AppProps) {
  useEffect(() => {
    // Initialize viewport height fix for mobile browsers
    initViewportHeight()
    
    return () => {
      cleanupViewportHeight()
    }
  }, [])

  return withTheme(
    <Layout project={get(pageProps, 'project', undefined)}>
      <GlobalLocale/>

      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </Layout>,
  )
}

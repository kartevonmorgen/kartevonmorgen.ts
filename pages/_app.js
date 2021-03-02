import { Provider } from 'react-redux'

import store from '../store'
import '../utils/icons/font-awesome'

import '../styles/globals.css'
import 'antd/dist/antd.css'


function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp

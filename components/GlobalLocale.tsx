import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import 'moment/locale/be'
import 'moment/locale/de'
import 'moment/locale/es'
import 'moment/locale/fr'
import 'moment/locale/it'
import 'moment/locale/nl'
import 'moment/locale/pt'
import 'moment/locale/ru'


const GlobalLocale: FC = (_props) => {
  const router = useRouter()
  const { locale } = router

  // todo: check for the existence of the locale before supplying to packages
  useEffect(() => {
    moment.locale(locale)
  }, [locale])

  return null
}


export default GlobalLocale

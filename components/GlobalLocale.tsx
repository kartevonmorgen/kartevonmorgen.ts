import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'


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

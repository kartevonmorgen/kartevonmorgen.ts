import { NextRouter } from 'next/router'


export const changeLocale = (newLocale: string, router: NextRouter) => {
  const { locales, query } = router

  if (locales.indexOf(newLocale) === -1) {
    return
  }

  router.replace(
    {
      query: query,
    },
    undefined,
    {
      shallow: false,
      locale: newLocale,
    },
  )

}
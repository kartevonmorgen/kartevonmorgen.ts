import { Button } from 'antd'
import React from 'react'
import useTranslation from 'next-translate/useTranslation'

type ShowMapBtnPropsType = {
  showMapByClickOnButton: () => void
}

export const ShowMapBtn = (props: ShowMapBtnPropsType) => {
  const { t } = useTranslation('home')
  return <Button size={'large'} onClick={props.showMapByClickOnButton}>
    {t('landingPage.city-search.show-map')}
  </Button>
}
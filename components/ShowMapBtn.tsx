import { Button } from 'antd'
import React from 'react'
import useTranslation from 'next-translate/useTranslation'

type ShowMapBtnPropsType = {
  showMapOnBtnClick: () => void
}

export const ShowMapBtn = React.memo((props: ShowMapBtnPropsType) => {
  const {t} = useTranslation('home')
  return <Button size={'large'} onClick={props.showMapOnBtnClick}>
    {t('landingPage.city-search.show-map')}
  </Button>
})
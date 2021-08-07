import { Button } from 'antd'
import React, { FC } from 'react'
import useTranslation from 'next-translate/useTranslation'

interface ShowMapButtonProps {
  showMapByClickOnButton: () => void
}

const ShowMapButton: FC<ShowMapButtonProps> = (props) => {
  const { showMapByClickOnButton } = props
  const { t } = useTranslation('home')

  return <Button size={'large'} onClick={showMapByClickOnButton}>
    {t('landingPage.city-search.show-map')}
  </Button>
}
export default ShowMapButton
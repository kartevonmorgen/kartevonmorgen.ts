import { FC } from 'react'
import { Button } from 'antd'
import useTranslation from 'next-translate/useTranslation'

interface ShowMapButtonProps {
  showMapByClickOnButton: () => void
  placeholder?: string
}

const ShowMapButton: FC<ShowMapButtonProps> = (props) => {
  const { showMapByClickOnButton, placeholder } = props
  const { t } = useTranslation('home')

  return <Button size={'large'} onClick={showMapByClickOnButton}>
    {placeholder ? placeholder : t('landingPage.city-search.show-map')}
  </Button>
}

export default ShowMapButton
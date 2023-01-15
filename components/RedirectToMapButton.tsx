import { FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { Button } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const redirectToMap = (router: NextRouter) => () => {
  router.push(
    {
      pathname: '/m/main',
    },
    undefined,
  )
}

const RedirectToMapButton: FC = () => {
  const router = useRouter()

  return (
    <Button
      type="text"
      size="small"
      icon={<FontAwesomeIcon icon={['far', 'map']}/>}
      onClick={redirectToMap(router)}
    />
  )
}


export default RedirectToMapButton

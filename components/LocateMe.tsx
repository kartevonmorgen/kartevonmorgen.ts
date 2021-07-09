import { FC } from 'react'
import { useRouter } from 'next/router'
import { Button } from 'antd'
import { updateRoutingQuery } from '../utils/utils'
import { AimOutlined } from '@ant-design/icons'


const getCurrentPosition = async (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position)
        },
        (err) => {
          reject(err)
        },
      )
    }
  })
}


const setQueryParamsToCurrentLocation = (router) => async () => {
  const { query } = router

  try {
    const currentPosition = await getCurrentPosition()
    const paramsToUpdate = {
      lat: currentPosition.coords.latitude.toFixed(4),
      lng: currentPosition.coords.longitude.toFixed(4),
    }

    const newQueryParams = updateRoutingQuery(query, paramsToUpdate)

    router.replace(
      {
        pathname: '/maps/[...slug]',
        query: newQueryParams,
      },
      undefined,
      { shallow: true },
    )
  } catch (e) {
    console.error('failed to get current location: ', e)
  }
}


const LocateMe: FC = () => {
  const router = useRouter()

  return (
    <Button
      type="primary"
      icon={<AimOutlined/>}
      onClick={setQueryParamsToCurrentLocation(router)}
    />
  )
}


export default LocateMe
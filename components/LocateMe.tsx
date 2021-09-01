import { FC } from 'react'
import { useRouter } from 'next/router'
import { Button } from 'antd'
import { updateRoutingQuery } from '../utils/utils'
import { AimOutlined } from '@ant-design/icons'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'
import { convertLatLngToString, LatLng } from '../utils/geolocation'


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
    const center: LatLng = {
      lat: currentPosition.coords.latitude,
      lng: currentPosition.coords.longitude,
    }
    const paramsToUpdate = {
      c: convertLatLngToString(center),
    }

    const newQueryParams = updateRoutingQuery(query, paramsToUpdate)
    const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)


    router.replace(
      {
        pathname: `/m/${newPath}`,
        query: newQueryWithoutSlug,
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
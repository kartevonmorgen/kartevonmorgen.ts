import { FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { Button, ButtonProps } from 'antd'
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


const setQueryParamsToCurrentLocation = (shouldIncludeDefaultProjectName: boolean, router: NextRouter) => async () => {
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

    const pathname: string = `/m/${shouldIncludeDefaultProjectName ? 'main' : ''}${newPath}`
    console.log(pathname)

    router.replace(
      {
        pathname,
        query: newQueryWithoutSlug,
      },
      undefined,
      { shallow: true },
    )
  } catch (e) {
    console.error('failed to get current location: ', e)
  }
}

interface LocateMeProps extends ButtonProps {
  shouldIncludeDefaultProjectName?: boolean
}

const LocateMe: FC<LocateMeProps> = (props) => {
  const { shouldIncludeDefaultProjectName } = props

  const router = useRouter()


  return (
    <Button
      {...props}
      icon={<AimOutlined/>}
      onClick={setQueryParamsToCurrentLocation(shouldIncludeDefaultProjectName, router)}
    />
  )
}

LocateMe.defaultProps = {
  shouldIncludeDefaultProjectName: false,
}


export default LocateMe
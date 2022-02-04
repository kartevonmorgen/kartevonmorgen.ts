import { useEffect } from 'react'
import { useRouter } from 'next/router'
import {useSelector} from 'react-redux'
import {shouldChangeZoomOnEntranceSelector} from '../selectors/entityDetail'
import { isValidLatLng, LatLng, PartialLatLng } from '../utils/geolocation'
import { setCenterAndZoom } from '../utils/map'
import MAP_CONSTANTS from '../consts/map'
import { RootState } from '../slices'
import { convertQueryParamToFloat, convertStringToFloat } from '../utils/utils'


const useFly = (partialLatLng: PartialLatLng) => {
  const router = useRouter()
  const {query: {z: zoomParam}} = router

  const shouldChangeZoomOnEntityDetailEntrance = useSelector(
    (state: RootState) => (shouldChangeZoomOnEntranceSelector(state))
  )

  const { lat, lng } = partialLatLng

  useEffect(() => {
    if (!isValidLatLng(partialLatLng)) {
      return
    }

    if (shouldChangeZoomOnEntityDetailEntrance) {
      setCenterAndZoom(router, partialLatLng as LatLng, MAP_CONSTANTS.map.close_zoom)
    } else {
      setCenterAndZoom(router, partialLatLng as LatLng, convertQueryParamToFloat(zoomParam))
    }

  }, [lat, lng])
}


export default useFly
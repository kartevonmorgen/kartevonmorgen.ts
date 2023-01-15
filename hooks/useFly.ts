import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { shouldChangeZoomAndCenterOnEntranceSelector } from '../selectors/entityDetail'
import { isValidLatLng, LatLng, PartialLatLng } from '../utils/geolocation'
import { setCenterAndZoom } from '../utils/map'
import MAP_CONSTANTS from '../consts/map'
import { RootState } from '../slices'
import { convertQueryParamToFloat, convertStringToFloat } from '../utils/utils'


const useFly = (partialLatLng: PartialLatLng) => {
  const router = useRouter()
  const { query: { z: zoomParam } } = router

  const shouldChangeZoomOnEntityDetailEntrance = useSelector(
    (state: RootState) => (shouldChangeZoomAndCenterOnEntranceSelector(state))
  )

  const { lat, lng } = partialLatLng

  useEffect(() => {
    if (!shouldChangeZoomOnEntityDetailEntrance) {
      return
    }

    if (!isValidLatLng(partialLatLng)) {
      return
    }

    setCenterAndZoom(router, partialLatLng as LatLng, MAP_CONSTANTS.map.close_zoom)

  }, [lat, lng])
}


export default useFly
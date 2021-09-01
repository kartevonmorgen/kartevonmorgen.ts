import toString from 'lodash/toString'
import isUndefined from 'lodash/isUndefined'
import { GeocodeAddress, NominatimResponse, reverseGeocode as nominatimReverseGeocode } from 'nominatim-browser'
import { convertFloatToString, SEP } from './utils'


// it was not possible to use the latlng from leaflet
// because throws the error "window is not defined"
export interface LatLng {
  lat: number
  lng: number
}

export interface ExtendedGeocodeAddress extends GeocodeAddress {
  town?: string
  municipality?: string
  village?: string
  hamlet?: string
  road?: string
}

export const reverseGeocode = async (latLng): Promise<NominatimResponse> => {
  return nominatimReverseGeocode({
    lat: toString(latLng.lat),
    lon: toString(latLng.lng),
    addressdetails: true,
  })
}

export const getCityFromAddress = (extendedAddress: ExtendedGeocodeAddress): string => {
  const regionPriorities = [
    'city',
    'town',
    'municipality',
    'village',
    'hamlet',
  ]

  for (const possibleRegion of regionPriorities) {
    if (!isUndefined(extendedAddress[possibleRegion])) {
      return possibleRegion
    }
  }

  return ''
}


export const convertLatLngToString = (latLng: LatLng): string => {
  const { lat, lng } = latLng
  const stringifiedLat: string = convertFloatToString(lat)
  const stringifiedLng: string = convertFloatToString(lng)

  const joinedLatLng: string = [stringifiedLat, stringifiedLng].join(SEP)

  return joinedLatLng
}
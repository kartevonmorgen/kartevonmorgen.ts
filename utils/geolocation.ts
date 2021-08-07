import toString from 'lodash/toString'
import isUndefined from 'lodash/isUndefined'
import { GeocodeAddress, NominatimResponse, reverseGeocode as nominatimReverseGeocode } from 'nominatim-browser'


export interface ExtendedGeocodeAddress extends GeocodeAddress {
  town?: string
  municipality?: string
  village?: string
  hamlet?: string
  road?: string
}

export const getCurrentPosition = async (): Promise<GeolocationPosition> => {
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
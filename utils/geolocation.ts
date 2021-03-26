import toString from 'lodash/toString'
import { NominatimResponse, reverseGeocode as nominatimReverseGeocode } from 'nominatim-browser'


export const reverseGeocode = async (latLng): Promise<NominatimResponse> => {
  return nominatimReverseGeocode({
    lat: toString(latLng.lat),
    lon: toString(latLng.lng),
    addressdetails: true,
  })
}
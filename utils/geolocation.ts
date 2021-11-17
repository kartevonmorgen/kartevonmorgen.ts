import toString from 'lodash/toString'
import isUndefined from 'lodash/isUndefined'
import isNumber from 'lodash/isNumber'
import {
  geocode,
  GeocodeAddress,
  GeocodeRequest,
  NominatimResponse,
  reverseGeocode as nominatimReverseGeocode,
} from 'nominatim-browser'
import { convertFloatToString, convertStringToFloat, SEP } from './utils'
import { GeoLocationStructuredAddress } from '../dtos/GeoLocationStructuredAddress'
import { FormInstance } from 'antd'
import { NextRouter } from 'next/router'
import { setCenterAndZoomAndNewPin } from './map'
import { DEFAULTS } from '../consts/map'


// it was not possible to use the latlng from leaflet
// because throws the error "window is not defined"
export interface LatLng {
  lat: number
  lng: number
}

export type PartialLatLng = Partial<LatLng>


export const isValidLatLng = (latLng: PartialLatLng): boolean => {
  const { lat, lng } = latLng

  const isValid: boolean = isNumber(lat) && isNumber(lng)

  return isValid
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
      return extendedAddress[possibleRegion]
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

//////////////////////

export type FormToAddressMapper = {
  [Property in keyof GeoLocationStructuredAddress]: string
}

const DefaultFormToAddressMapper: FormToAddressMapper = {
  city: 'city',
  street: 'street',
  postalcode: 'zip',
}

const getStructuredAddressFromForm = (
  form: FormInstance,
  mapper: FormToAddressMapper = DefaultFormToAddressMapper,
): GeoLocationStructuredAddress => {

  const structuredAddressExtractedFromForm: GeoLocationStructuredAddress = {}

  Object.keys(mapper).forEach((addressField: string) => {
    structuredAddressExtractedFromForm[addressField] = form.getFieldValue(mapper[addressField])
  })

  return structuredAddressExtractedFromForm
}

export const flyToFormAddressAndSetNewPin = async (router: NextRouter, form: FormInstance) => {
  const structuredAddressFromForm: GeoLocationStructuredAddress = getStructuredAddressFromForm(form)
  const geoLocationRequest: GeocodeRequest = {
    street: structuredAddressFromForm.street,
    city: structuredAddressFromForm.city,
    county: structuredAddressFromForm.county,
    state: structuredAddressFromForm.state,
    country: structuredAddressFromForm.country,
    postalcode: structuredAddressFromForm.postalcode,
    limit: 1,
  }

  let locations: NominatimResponse[] = []
  try {
    locations = await geocode(geoLocationRequest)
  } catch (e) {
    return
  }

  if (locations.length === 0) {
    return
  }

  const location = locations[0]
  const newCenter: LatLng = {
    lat: convertStringToFloat(location.lat),
    lng: convertStringToFloat(location.lon),
  }

  setCenterAndZoomAndNewPin(router, newCenter, DEFAULTS.close_zoom)
}
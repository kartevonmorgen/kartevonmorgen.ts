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
import MAP_CONSTANTS from '../consts/map'
import { EventID } from '../dtos/Event'
import { BASICS_ENDPOINTS } from '../api/endpoints/BasicsEndpoints'
import { StatusCodes } from 'http-status-codes'
import { SearchEntryID } from '../dtos/SearchEntry'
import { Entry } from '../dtos/Entry'
import Event from '../dtos/Event'
import { RootSlugEntity } from './types'
import {NamePath} from 'rc-field-form/lib/interface'


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

export const reverseGeocode = async (latLng: LatLng): Promise<NominatimResponse> => {
  return nominatimReverseGeocode({
    lat: toString(latLng.lat),
    lon: toString(latLng.lng),
    addressdetails: true,
  })
}

export const getCityFromAddress = (extendedAddress: ExtendedGeocodeAddress): string => {
  const regionPriorities: (keyof ExtendedGeocodeAddress)[] = [
    'city',
    'town',
    'municipality',
    'village',
    'hamlet',
  ]

  if (!extendedAddress) {
    return ''
  }

  for (const possibleRegion of regionPriorities) {
    if (!isUndefined(extendedAddress[possibleRegion])) {
      return extendedAddress[possibleRegion] as string
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
    structuredAddressExtractedFromForm[addressField as keyof GeoLocationStructuredAddress] = form.getFieldValue(mapper[addressField as keyof FormToAddressMapper] as NamePath)
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
  }

  if (locations.length === 0) {
    return
  }

  const location = locations[0]
  const newCenter: LatLng = {
    lat: convertStringToFloat(location.lat),
    lng: convertStringToFloat(location.lon),
  }

  setCenterAndZoomAndNewPin(router, newCenter, MAP_CONSTANTS.map.close_zoom)
}

export const getEntryLocation = async (entryId: SearchEntryID): Promise<LatLng | null> => {
  let entry: Entry | null= null
  try {
    const entryResponse = await fetch(`${BASICS_ENDPOINTS.getEntries()}/${entryId}`)
    if (entryResponse.status !== StatusCodes.OK) {
      return null
    }

    const entryResponseJson = await entryResponse.json()
    if (entryResponseJson.length === 0) {
      return null
    }

    entry = entryResponseJson[0]
  } catch (e) {
    return null
  }

  if (!entry) {
    return null
  }

  const latLng: LatLng = {
    lat: entry.lat,
    lng: entry.lng
  }

  return latLng
}

export const getEventLocation = async (eventId: EventID): Promise<LatLng | null> => {
  let event: Event | null = null
  try {
    const eventResponse = await fetch(`${BASICS_ENDPOINTS.getEvent()}/${eventId}`)
    if (eventResponse.status !== StatusCodes.OK) {
      return null
    }

    event = await eventResponse.json()
  } catch (e) {
    return null
  }

  if (!event) {
    return null
  }

  const latLng: LatLng = {
    lat: event.lat,
    lng: event.lng
  }

  return latLng
}

export const getOptionalEntityLocation = async (entityId: SearchEntryID, entityType: RootSlugEntity): Promise<LatLng | null> => {
  let optionalLatLng: LatLng | null = null
  switch (entityType){
    case RootSlugEntity.RESULT:
      return optionalLatLng
    case RootSlugEntity.EVENT:
      optionalLatLng = await getEventLocation(entityId)
      return optionalLatLng
    case RootSlugEntity.COMPANY:
      optionalLatLng = await getEntryLocation(entityId)
      return optionalLatLng
    case RootSlugEntity.INITIATIVE:
      optionalLatLng = await getEntryLocation(entityId)
      return optionalLatLng
    case RootSlugEntity.ENTRY:
      optionalLatLng = await getEntryLocation(entityId)
      return optionalLatLng
    default:
      return optionalLatLng
  }
}

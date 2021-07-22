import { BASICS_ENDPOINTS } from './BasicsEndpoints'
import { OFDB_ENDPOINTS } from './OFDBEndpoints'
import { GEOLOCATION_ENDPOINTS } from './GEOLocationEndpoints'
import { RootSlugEntity } from '../../utils/types'


export const mapEntityToOFDB = {
  [RootSlugEntity.ENTRY]: OFDB_ENDPOINTS.getOFDBEntry,
  [RootSlugEntity.EVENT]: OFDB_ENDPOINTS.getOFDBEvent,
}

export const API_ENDPOINTS = {
  ...BASICS_ENDPOINTS,
  ...OFDB_ENDPOINTS,
  ...GEOLOCATION_ENDPOINTS,
}

export default API_ENDPOINTS
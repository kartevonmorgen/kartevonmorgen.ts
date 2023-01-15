import { GeoLocationStructuredAddress } from './GeoLocationStructuredAddress'


export interface GeoLocationRequest extends GeoLocationStructuredAddress {
  q?: string
  format?: 'xml' | 'json' | 'jsonv2' | 'geojson' | 'geocodejson'
  json_callback?: string
  addressdetails?: 0 | 1
  extratags?: 0 | 1
  namedetails?: 0 | 1
  countrycodes?: string
  exclude_place_ids?: string
  limit?: number
  viewbox?: string
  bounded?: 0 | 1
  polygon_geojson?: 1
  polygon_kml?: 1
  polygon_svg?: 1
  polygon_text?: 1
  polygon_threshold?: number
  email?: string
  dedupe?: 0 | 1
  debug?: 0 | 1
}
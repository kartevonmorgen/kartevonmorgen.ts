export interface GeoLocation {
  place_id: number
  lat: string
  lon: string
  display_name: string
}

export type GeoLocations = GeoLocation[]
import { GeoLocation, GeoLocations } from '../dtos/GeoLocatoinResponse'
import type { DefaultOptionType } from 'rc-select/lib/Select'


type SelectOptions = DefaultOptionType[]

export const convertGeoLocationsToSelectOptions = (geoLocations: GeoLocations): SelectOptions => {
  return geoLocations.map((geoLocation: GeoLocation) => ({
    label: geoLocation.display_name,
    value: geoLocation.display_name,
  }))
}

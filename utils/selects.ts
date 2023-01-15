import { GeoLocation, GeoLocations } from '../dtos/GeoLocatoinResponse'
import { OptionData, OptionGroupData } from 'rc-select/lib/interface'


type SelectOptions = (OptionData | OptionGroupData)[]

export const convertGeoLocationsToSelectOptions = (geoLocations: GeoLocations): SelectOptions => {
  return geoLocations.map((geoLocation: GeoLocation) => ({
    label: geoLocation.display_name,
    value: geoLocation.display_name,
  }))
}
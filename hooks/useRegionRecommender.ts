import { OptionData, OptionGroupData } from 'rc-select/lib/interface'
import useRequest from '../api/useRequest'
import API_ENDPOINTS from '../api/endpoints'
import { CSVToOptionDataResponse } from '../utils/csv'
import { GeoLocations } from '../dtos/GeoLocatoinResponse'
import { convertGeoLocationsToSelectOptions } from '../utils/selects'


type ResultOptions = (OptionData | OptionGroupData)[]


const useRegionRecommender = (
  term: string,
  regionsGroupName: string,
  limit: number = 10,
): ResultOptions => {
  const { data: regionsResponse, error: regionsResponseError } = useRequest<CSVToOptionDataResponse>({
    url: API_ENDPOINTS.getRegions(regionsGroupName),
  })

  const { data: geoLocations, error: geoLocationError } = useRequest<GeoLocations>({
    url: API_ENDPOINTS.queryGeoLocations(),
    params: {
      q: term,
      format: 'json',
      limit,
    },
  })

  // there's not term in the regional search input and the regions api has some results
  if (
    term.length === 0 &&
    !regionsResponseError &&
    regionsResponse
  ) {
    return regionsResponse.data.slice(0, limit)
  }

  // if nominatim is responding
  if (
    geoLocations &&
    !geoLocationError
  ) {
    const selectOptionsFromGeoLocations = convertGeoLocationsToSelectOptions(geoLocations)

    return selectOptionsFromGeoLocations
  }

  // none of the apis are responding
  return [] as ResultOptions
}


export default useRegionRecommender
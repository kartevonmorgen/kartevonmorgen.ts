import { OptionData, OptionGroupData } from 'rc-select/lib/interface'
import useRequest from '../api/useRequest'
import API_ENDPOINTS from '../api/endpoints'
import { CSVToOptionDataResponse } from '../utils/csv'


type ResultOptions = (OptionData | OptionGroupData)[]


const useRegionRecommender = (
  term: string,
  regionsGroupName: string,
): ResultOptions => {
  const { data: regionsResponse, error: regionsResponseError } = useRequest<CSVToOptionDataResponse>({
    url: API_ENDPOINTS.getRegions(regionsGroupName),
  })

  if (
    term.length === 0 &&
    !regionsResponseError &&
    regionsResponse
  ) {
    return regionsResponse.data
  }

}


export default useRegionRecommender
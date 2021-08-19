import useRequest from '../api/useRequest'
import API_ENDPOINTS from '../api/endpoints'
import { SearchEntryID } from '../dtos/SearchEntry'
import { SearchEntriesRequest } from '../dtos/SearchEntriesRequest'
import SearchEntriesResponse from '../dtos/SearchEntriesResponse'


const useEntrySearcher = (entryId: SearchEntryID) => {

  // bbox is compulsory so we search fot the whole world
  const searchEntryRequest: SearchEntriesRequest = {
    bbox: '-90,-180,90,180',
    ids: entryId,
  }

  const { data: searchEntries, error } = useRequest<SearchEntriesResponse>({
    url: `${API_ENDPOINTS.searchEntries()}/`,
    params: searchEntryRequest,
  })

  if (error) {
    return [searchEntries, error]
  }

  if (!searchEntries) {
    return [searchEntries, error]
  }

  const { visible } = searchEntries

  if (visible.length === 0) {
    return [searchEntries, 'entry not found']
  }

  return [visible[0], error]
}


export default useEntrySearcher
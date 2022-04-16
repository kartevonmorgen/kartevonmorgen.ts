import useRequest, { Return } from '../api/useRequest'
import { TagFrequency } from '../dtos/TagFrequency'
import API_ENDPOINTS from '../api/endpoints'
import { MostPopularTagsParams } from '../pages/api/next/v0/entries/most-popular-tags'


const useTagMatcher = (params: MostPopularTagsParams): Return<TagFrequency[], unknown> => {
  return useRequest<TagFrequency[]>({
    url: API_ENDPOINTS.getPopularTags(),
    params,
  })
}


export default useTagMatcher
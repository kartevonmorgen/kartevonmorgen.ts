import { useRouter } from 'next/router'
import { getProjectNameFromQuery } from '../utils/slug'
import useRequest from '../api/useRequest'
import { TagMarkerColorResponse } from '../pages/api/v0/maps/[project]/tags/markers/colors'
import { TagMarkerColors } from '../dtos/TagMarkerColors'
import { BASICS_ENDPOINTS } from '../api/endpoints/BasicsEndpoints'


const useAllTagMarkerColors = (): TagMarkerColors => {
  const router = useRouter()
  const { query } = router
  const project = getProjectNameFromQuery(query)

  const { data: response } = useRequest<TagMarkerColorResponse>({
    url: BASICS_ENDPOINTS.getTagMarkerColors(project),
    // No tags parameter - fetch all colors
  })

  if (!response || !response.hasData || !Array.isArray(response.data)) {
    return []
  }

  return response.data as TagMarkerColors
}


export default useAllTagMarkerColors

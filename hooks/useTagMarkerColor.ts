import { useRouter } from 'next/router'
import { getProjectNameFromQuery } from '../utils/slug'
import useRequest from '../api/useRequest'
import { TagMarkerColor } from '../dtos/TagMarkerColors'
import { TagMarkerColorResponse } from '../pages/api/v0/maps/[project]/tags/markers/colors'
import Tag from '../dtos/Tag'
import { BASICS_ENDPOINTS } from '../api/endpoints/BasicsEndpoints'


const useTagMarkerColor = (tags: Tag[]) => {
  const router = useRouter()
  const { query } = router
  const project = getProjectNameFromQuery(query)

  const {data: customMarkerColor} = useRequest<TagMarkerColorResponse>({
    url: BASICS_ENDPOINTS.getTagMarkerColors(project),
    params: {
      tags: tags.join()
    }
  })

  if (!customMarkerColor || !customMarkerColor.hasData) {
    return ''
  }

  return (customMarkerColor.data as TagMarkerColor).color
}


export default useTagMarkerColor

import { useRouter } from 'next/router'
import { convertQueryParamToString } from '../utils/utils'


const useRatingsVisibility = (): boolean => {
  const router = useRouter()
  const { query } = router

  // Check query parameter (only source of truth)
  const ratingsQueryParam = convertQueryParamToString(query.ratings)
  
  if (ratingsQueryParam === 'hide') {
    return false
  }

  // Default to show
  return true
}


export default useRatingsVisibility

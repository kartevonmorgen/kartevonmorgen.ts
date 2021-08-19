import { FC } from 'react'
import { Button } from 'antd'
import { NextRouter, useRouter } from 'next/router'
import { convertQueryParamToFloat, updateRoutingQuery } from '../utils/utils'
import { useSelector } from 'react-redux'
import { RootState } from '../slices'
import searchResultSelector from '../selectors/searchResults'


const MIN_REQUIRED_RESULTS = 20


interface SidebarZoomOutButtonProps {
  divisionFactor?: number
}


const zoomOut = (divisionFactor: number, router: NextRouter) => () => {

  const { query } = router
  const { zoom } = query

  const currentZoom = convertQueryParamToFloat(zoom)
  const newZoom = currentZoom / divisionFactor

  const newQueryParams = updateRoutingQuery(query, { 'zoom': newZoom.toFixed(2) })

  router.replace(
    {
      query: newQueryParams,
    },
    undefined,
    { shallow: true },
  )
}

const SidebarZoomOutButton: FC<SidebarZoomOutButtonProps> = (props) => {
  const { divisionFactor } = props

  const router = useRouter()

  const numberOfSearchResults: number = useSelector(
    (state: RootState) => searchResultSelector(state).length,
  )

  if (numberOfSearchResults >= MIN_REQUIRED_RESULTS) {
    return null
  }

  return (
    <Button
      type="primary"
      onClick={zoomOut(divisionFactor, router)}
      style={{
        width: '100%',
      }}
    >
      Zoom Out
    </Button>
  )
}


SidebarZoomOutButton.defaultProps = {
  divisionFactor: 2,
}


export default SidebarZoomOutButton
import { FC } from 'react'
import { Button } from 'antd'
import { NextRouter, useRouter } from 'next/router'
import { convertQueryParamToFloat, updateRoutingQuery } from '../utils/utils'


const zoomOut = (divisionFactor: number, router: NextRouter) => () => {
  const { query } = router
  const { z: zoom } = query

  const currentZoom = convertQueryParamToFloat(zoom)
  const newZoom = currentZoom / divisionFactor

  const newQueryParams = updateRoutingQuery(query, { 'z': newZoom.toFixed(2) })

  router.replace(
    {
      query: newQueryParams,
    },
    undefined,
    { shallow: true },
  )
}


interface SidebarZoomOutButtonProps {
  divisionFactor?: number
  visible?: boolean
}

const SidebarZoomOutButton: FC<SidebarZoomOutButtonProps> = (props) => {
  const { divisionFactor, visible } = props

  const router = useRouter()

  if (!visible) {
    return null
  }

  return (
    <div
      style={{
        width: '100%',
        paddingLeft: 16,
        paddingRight: 16,
        marginTop: 16,
        marginBottom: 16,
      }}
    >
      <Button
        type="primary"
        onClick={zoomOut(divisionFactor, router)}
        style={{
          width: '100%',
        }}
      >
        Zoom Out
      </Button>
    </div>
  )
}


SidebarZoomOutButton.defaultProps = {
  divisionFactor: 2,
  visible: false,
}


export default SidebarZoomOutButton

import { FC } from 'react'
import { useRouter, NextRouter } from 'next/router'
import { Switch } from 'antd'
import { MapColorModes } from './MapColorStyle'
import { removeRoutingQueryParams, updateRoutingQuery } from '../utils/utils'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'



const setColorMode = (router: NextRouter, colorMode: MapColorModes) => {
  const { query } = router

  let newQueryParams = {}
  if (colorMode === MapColorModes.STANDARD) {
    newQueryParams = removeRoutingQueryParams(query, ['mapColorMode'])
  } else {
    newQueryParams = updateRoutingQuery(query, {
        mapColorMode: colorMode,
    })
  }

  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  router.replace(
    {
      pathname: `/m/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )
}


const toggleMapColorMode = (router: NextRouter, shouldSetToGrey: boolean) => {
  const mapColorMode = shouldSetToGrey ? MapColorModes.GRAY : MapColorModes.STANDARD

  setColorMode(router, mapColorMode)
}


const MapColorModeButton: FC = () => {
    const router = useRouter()

    return (
        <Switch
            checkedChildren="Gray"
            unCheckedChildren="Normal"
            onChange={(shouldSetToGrey: boolean) => toggleMapColorMode(router, shouldSetToGrey)}
        />
    )
}


export default MapColorModeButton

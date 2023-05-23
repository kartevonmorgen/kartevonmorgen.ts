import { FC, useState } from 'react'
import { useDebounce } from 'ahooks'
import { AutoComplete, Input } from 'antd'
import { NextRouter, useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { convertStringToFloat, updateRoutingQuery } from '../utils/utils'
import useRegionRecommender from '../hooks/useRegionRecommender'
import { GeoLocations } from '../dtos/GeoLocatoinResponse'
import { AxiosInstance } from '../api'
import API_ENDPOINTS from '../api/endpoints'
import { createSlugPathFromQueryAndRemoveSlug, getProjectNameFromQuery } from '../utils/slug'
import { convertLatLngToString, LatLng } from '../utils/geolocation'
import MAP_CONSTANTS from '../consts/map'


const fetchLocationFromRegionName = async (regionName: string): Promise<LatLng> => {
  // todo: catch error if the region api did not responded successfully
  const regionLookupResponse =
    await AxiosInstance.GetRequest<GeoLocations>(
      API_ENDPOINTS.queryGeoLocations(),
      {
        params: {
          limit: 1,
          q: regionName,
          format: 'json',
        },
      },
    )

  const regionLookup = AxiosInstance.GetSuccessData(regionLookupResponse)

  // could find a region with that name
  if (regionLookup.length === 0) {
    return Promise.reject('no matching region found')
  }

  const region = regionLookup[0]
  const regionLatLng: LatLng = {
    lat: convertStringToFloat(region.lat, 4),
    lng: convertStringToFloat(region.lon, 4),
  }

  return regionLatLng
}

const changeLatAndLngFromRegionName = async (router: NextRouter, regionName: string) => {

  try {
    const regionCenter = await fetchLocationFromRegionName(regionName)

    const paramsToUpdate = {
      c: convertLatLngToString(regionCenter),
      z: MAP_CONSTANTS.map.regional_zoom.toFixed(MAP_CONSTANTS.precisions.zoom)
    }

    const { query } = router
    const newQueryParams = updateRoutingQuery(query, paramsToUpdate)
    const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

    router.replace(
      {
        pathname: `/m/${newPath}`,
        query: newQueryWithoutSlug,
      },
      undefined,
      { shallow: true },
    )
  } catch (e) {

  }
}

const SearchRegion: FC = () => {
  const router = useRouter()
  const { query } = router

  const project = getProjectNameFromQuery(query)

  const [regionNameToSearch, setRegionNameToSearch] = useState<string>('')
  const debouncedNameRegionToSearch = useDebounce(regionNameToSearch, { wait: 1000 })

  const regionsOptions = useRegionRecommender(debouncedNameRegionToSearch, project)

  const { t } = useTranslation('map')

  return (
    <AutoComplete
      allowClear
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      showSearch
      options={regionsOptions}
      onSearch={(value: string) => {
        setRegionNameToSearch(value)
      }}
      onSelect={async (value) => {
        setRegionNameToSearch(value)
        await changeLatAndLngFromRegionName(router, value)
      }}
      placeholder={t('searchFilters.selectRegion')}
      style={{
        width: '100%',
      }}
    >
      <Input
        onPressEnter={async () => {
          await changeLatAndLngFromRegionName(router, debouncedNameRegionToSearch)
        }}
      />
    </AutoComplete>
  )
}


export default SearchRegion

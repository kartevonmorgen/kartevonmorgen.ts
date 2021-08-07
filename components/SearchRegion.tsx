import { FC, useState } from 'react'
import { useDebounce } from 'ahooks'
import { Select } from 'antd'
import useRegionRecommender from '../hooks/useRegionRecommender'
import { NextRouter, useRouter } from 'next/router'
import { convertQueryParamToString, convertStringToFloat, updateRoutingQuery } from '../utils/utils'
import { GeoLocations } from '../dtos/GeoLocatoinResponse'
import { AxiosInstance } from '../api'
import API_ENDPOINTS from '../api/endpoints'
import toString from 'lodash/toString'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'
import useTranslation from 'next-translate/useTranslation'


interface Center {
  lat: number
  lng: number
}

const fetchLocationFromRegionName = async (regionName: string): Promise<Center> => {
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
  return {
    lat: convertStringToFloat(region.lat, 4),
    lng: convertStringToFloat(region.lon, 4),
  }
}

const changeLatAndLngFromRegionName = (router: NextRouter) => async (regionName: string) => {
  try {
    const regionCenter = await fetchLocationFromRegionName(regionName)

    const paramsToUpdate = {
      lat: toString(regionCenter.lat),
      lng: toString(regionCenter.lng),
    }

    const { query } = router
    const newQueryParams = updateRoutingQuery(query, paramsToUpdate)
    const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

    router.replace(
      {
        pathname: `/maps/${newPath}`,
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
  const { t } = useTranslation('map')

  const { dropdowns } = query
  const regionsGroup = convertQueryParamToString(dropdowns, 'main')

  const [regionNameToSearch, setRegionNameToSearch] = useState<string>('')
  const debouncedNameRegionToSearch = useDebounce(regionNameToSearch, { wait: 50 })

  const regionsOptions = useRegionRecommender(debouncedNameRegionToSearch, regionsGroup)

  return (
    <Select
      allowClear
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      showSearch
      options={regionsOptions}
      onSearch={(term: string) => {
        setRegionNameToSearch(term)
      }}
      onSelect={changeLatAndLngFromRegionName(router)}
      onClear={() => {
        setRegionNameToSearch('')
      }}
      placeholder={t('searchFilters.selectRegion')}
      style={{
        width: '100%',
        marginTop: 8,
      }}
    />
  )
}


export default SearchRegion
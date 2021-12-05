import React, { FC, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { AutoComplete, Input } from 'antd'
import debounce from 'lodash/debounce'
import useRequest from '../api/useRequest'
import { GeoLocations } from '../dtos/GeoLocatoinResponse'
import API_ENDPOINTS from '../api/endpoints/'
import LocateMe from './LocateMe'
import RedirectToMapButton from './RedirectToMapButton'


interface Option {
  label: string
  value: string
}

const onSelect = (router: NextRouter) => (value: string) => {
  const center: string = value

  router.push(
    {
      pathname: '/m/main',
      query: {
        c: center,
        z: 10,
      },
    },
    undefined,
    { shallow: false },
  )
}


const convertGeoLocationsToOptions = (geoLocations: GeoLocations): Option[] => {
  const options: Option[] = geoLocations.map((geoLocation) => {
      const { lat, lon, display_name } = geoLocation

      return ({
        label: display_name,
        value: [lat, lon].join(),
      })
    },
  )

  return options
}


const HomeCitySearch: FC = () => {
  const router = useRouter()
  const { t } = useTranslation('home')
  const [searchTerm, setSearchTerm] = useState<string>('')

  const { data: geoLocations, error: geoLocationError } = useRequest<GeoLocations>({
    url: API_ENDPOINTS.queryGeoLocations(),
    params: {
      q: searchTerm,
      format: 'json',
      limit: 10,
    },
  })

  const couldFetchGeoLocations: boolean = geoLocations && !geoLocationError

  let options = []
  if (couldFetchGeoLocations) {
    options = convertGeoLocationsToOptions(geoLocations)
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        width: 'inherit',
      }}
    >
      <AutoComplete
        showArrow={false}
        filterOption={false}
        notFoundContent={null}
        dropdownMatchSelectWidth={600}
        options={options}
        onSelect={onSelect(router)}
        onSearch={debounce(setSearchTerm, 400)}
        style={{ width: '100%' }}
      >
        <Input
          size="large"
          placeholder={t('landingPage.city-search.placeholder')}
          addonBefore={
            <LocateMe
              type="text"
              size="middle"
              shouldIncludeDefaultProjectName
            />
          }
          addonAfter={<RedirectToMapButton/>}
        />
      </AutoComplete>

    </div>
  )
}


export default HomeCitySearch

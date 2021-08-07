import React, { FC, useEffect, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { Select } from 'antd'
import debounce from 'lodash/debounce'
import useRequest from '../api/useRequest'
import { GeoLocations } from '../dtos/GeoLocatoinResponse'
import API_ENDPOINTS from '../api/endpoints/'
import { ShowMapBtn } from './ShowMapBtn'


const { Option } = Select


const onSelect = (router: NextRouter) => (value: string) => {
  const [lat, lng] = value.split(',')

  router.push(
    {
      pathname: '/maps/home',
      query: {
        lat,
        lng,
        zoom: 10,
      },
    },
    undefined,
    { shallow: false },
  )
}


const HomeCitySearch: FC = React.memo(() => {
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

  const showMapByClickOnButton = () => {
    router.push('/maps/main')
  }

  const [show, setShow] = useState<boolean>(false)
  useEffect(() => {
    if (searchTerm.length > 0 && geoLocations?.length === 0) {
      setShow(true)
    }
    if (searchTerm.length === 0 || geoLocations?.length > 0) {
      setShow(false)
    }
  }, [geoLocations])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <Select
        showSearch
        showArrow={false}
        filterOption={false}
        notFoundContent={null}
        dropdownMatchSelectWidth={252}
        style={{ width: 250 }}
        onSelect={onSelect(router)}
        onSearch={debounce(setSearchTerm, 400)}
        placeholder={t('landingPage.city-search.placeholder')}
        size='large'
      >
        {
          geoLocations && !geoLocationError && (
            geoLocations.map(({ lat, lon, display_name, place_id }) => (
              <Option
                key={`geoLocationOption-${place_id}`}
                value={[lat, lon].join()}
              >
                {display_name}
              </Option>
            ))
          )
        }
      </Select>

      <div>
        {
          show && <ShowMapBtn showMapByClickOnButton={showMapByClickOnButton} />
        }
      </div>
    </div>
  )
})


export default HomeCitySearch
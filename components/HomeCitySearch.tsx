import { FC, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { AutoComplete, Button, SelectProps } from 'antd'
import { LocateOutline } from 'react-ionicons'


function getRandomInt(max: number, min: number = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min // eslint-disable-line no-mixed-operators
}

const searchResult = (query: string) =>
  new Array(getRandomInt(5))
    .join('.')
    .split('.')
    .map((_, idx) => {
      const category = `${query}${idx}`
      return {
        value: category,
        label: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>
              Found {query} on{' '}
              <a
                href={`https://s.taobao.com/search?q=${query}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {category}
              </a>
            </span>
            <span>{getRandomInt(200, 100)} results</span>
          </div>
        ),
      }
    })


const HomeCitySearch: FC = () => {
  const router = useRouter()
  const [options, setOptions] = useState<SelectProps<object>['options']>([])

  const handleSearch = (value: string) => {
    setOptions(value ? searchResult(value) : [])
  }

  const onSelect = (value: string) => {
    console.log('onSelect', value)
  }

  const locateUser = (router: NextRouter) => () => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude: lat, longitude: lng } = position.coords

      router.push(
        {
          pathname: '/maps/main',
          query: { lat, lng, zoom: 10 },
        },
        undefined,
        { shallow: false },
      )
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <AutoComplete
        dropdownMatchSelectWidth={252}
        style={{ width: 250 }}
        options={options}
        onSelect={onSelect}
        onSearch={handleSearch}
        placeholder="Which place would you like to discover?"
        size="large"
      />

      <Button
        onClick={locateUser(router)}
        type="primary"
        size="large"
        icon={
          <LocateOutline
            color={'#fff'}
            title="locate me"
            height="25px"
            width="25px"
          />
        }
      />
    </div>
  )
}


export default HomeCitySearch
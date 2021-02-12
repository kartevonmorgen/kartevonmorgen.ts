import qs from 'qs'
import { useRouter } from 'next/router'
import produce from 'immer'

import { Input } from 'antd'

import { removeDynamicRoutingParams, updateRoutingParams } from '../utils/utils'

import { MAP_ROUTING as MAP_ROUTING_CONSTS } from '../consts/map'

const { Search } = Input


const onSearch = (router) => (searchTerm, _event) => {
  const { query } = router
  const project = query.project ?? 'main'

  const searchURLParamKey = 'search'

  let newQueryParams = updateRoutingParams(query, { [searchURLParamKey]: searchTerm })
  // it's an empty string so let's remove the param from the URL
  // because we have added that from the update so we are sure the key exists
  if (searchTerm.length === 0) {
    newQueryParams = produce(newQueryParams, draftState => {
      delete draftState[searchURLParamKey]
    })
  }

  newQueryParams = removeDynamicRoutingParams(newQueryParams, MAP_ROUTING_CONSTS.dynamicParams)

  router.replace(
    `/maps/${project}?${qs.stringify(newQueryParams, { arrayFormat: 'repeat' })}`,
    undefined,
    { shallow: true },
  )
}


const SearchInput = () => {
  const router = useRouter()

  return (
    <Search
      placeholder="input search text"
      allowClear
      enterButton
      onSearch={onSearch(router)}
    />
  )
}

export default SearchInput
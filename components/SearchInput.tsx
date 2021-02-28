import { useRouter } from 'next/router'
import produce from 'immer'

import { Input } from 'antd'

import { updateRoutingQuery } from '../utils/utils'

const { Search } = Input


const onSearch = (router) => (searchTerm, _event) => {
  const { query } = router

  const searchURLParamKey = 'search'

  let newQueryParams = updateRoutingQuery(query, { [searchURLParamKey]: searchTerm })
  // it's an empty string so let's remove the param from the URL
  // because we have added that from the update so we are sure the key exists
  if (searchTerm.length === 0) {
    newQueryParams = produce(newQueryParams, draftState => {
      delete draftState[searchURLParamKey]
    })
  }

  router.replace(
    {
      pathname: '/maps/[...slug]',
      query: newQueryParams,
    },
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
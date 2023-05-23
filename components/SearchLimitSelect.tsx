import { Dispatch, FC, useEffect, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { Select } from 'antd'
import toString from 'lodash/toString'
import useTranslation from 'next-translate/useTranslation'
import { convertUnknownToInt, removeRoutingQueryParams, updateRoutingQuery } from '../utils/utils'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'


const { Option } = Select

const removeLimitFromRouter = (router: NextRouter) => {

  const { query } = router

  const queryParamsWithoutLimit = removeRoutingQueryParams(query, ['limit'])
  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(queryParamsWithoutLimit)

  router.replace(
    {
      pathname: `/m/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )
}

const setLimitToRouter = (router: NextRouter) => (limit: number) => {
  const { query } = router
  const newQueryParams = updateRoutingQuery(query, { limit: toString(limit) })

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

const removeLimitFromRouterAndSetLimitToNull = (router: NextRouter, setLimit: Dispatch<null>) => () => {
  setLimit(null)
  removeLimitFromRouter(router)
}

const limits: number[] = [25, 50, 100, 200, 300, 500]

const SearchLimitSelect: FC = () => {
  const { t } = useTranslation('map')

  const router = useRouter()
  const { query } = router
  const { limit: limitParam } = query
  const limitFromRouterQuery = convertUnknownToInt(limitParam)

  const [limit, setLimit] = useState<number | null>(null)

  useEffect(() => {
    if (limitFromRouterQuery !== 0) {
      setLimit(limitFromRouterQuery)
    }
  }, [limitFromRouterQuery])


  return (
    <Select
      allowClear
      value={limit}
      style={{ width: '100%' }}
      placeholder={t('searchFilters.resultLimit')}
      onClear={removeLimitFromRouterAndSetLimitToNull(router, setLimit)}
      onSelect={setLimitToRouter(router)}
    >
      {
        limits.map((limit) => (
          <Option key={`search-limit-option-${limit}`} value={limit}>{limit}</Option>
        ))
      }
    </Select>
  )
}


export default SearchLimitSelect

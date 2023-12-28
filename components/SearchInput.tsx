import { Dispatch, FC, useEffect, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { produce } from 'immer'
import { AutoComplete, Input } from 'antd'
import { useDebounce } from 'ahooks'
import useTranslation from 'next-translate/useTranslation'
import useSearchRecommender from '../hooks/useSearchRecommender'
import SearchOutlined from '@ant-design/icons/SearchOutlined'
import { convertQueryParamToString, updateRoutingQuery } from '../utils/utils'
import { createSlugPathFromQueryAndRemoveSlug, getProjectNameFromQuery } from '../utils/slug'
import { isRouterInitialized } from '../utils/router'


const onSearch = (router: NextRouter, searchTerm: string) => {
  const { query } = router

  const searchURLParamKey = 'search'

  let newQueryParams = updateRoutingQuery(query, { [searchURLParamKey]: searchTerm })
  // it's an empty string so let's remove the param from the URL
  // because we have added that from the update so we are sure the key exists
  if (searchTerm.length === 0) {
    newQueryParams = produce(newQueryParams, (draftState) => {
      delete draftState[searchURLParamKey]
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

const onSelect = (setSearchTerm: Dispatch<any>) => (term: string) => {
  setSearchTerm((prevTerm: string) => {
    const prevSearchTokens = prevTerm.trim().split(' ')
    const lastToken = prevSearchTokens[prevSearchTokens.length - 1]

    if (!lastToken) {
      return term
    }

    if (term.startsWith(lastToken)) {
      return [...prevSearchTokens.slice(0, prevSearchTokens.length - 1), term].join(' ')
    }

    return `${prevTerm} ${term}`
  })
}

const SearchInput: FC = () => {
  const router = useRouter()
  const { query } = router

  const { search: searchQuery } = query
  const project = getProjectNameFromQuery(query)
  const searchTermFromURL: string = convertQueryParamToString(searchQuery)

  const categoryGroup = convertQueryParamToString(project, 'main')

  const [searchTerm, setSearchTerm] = useState<string>('')
  const debouncedTokenToSearch = useDebounce(searchTerm, { wait: 500 })

  const { t } = useTranslation('map')

  useEffect(() => {
    setSearchTerm(searchTermFromURL)
  }, [searchTermFromURL])

  const searchOptions = useSearchRecommender(debouncedTokenToSearch, categoryGroup)

  useEffect(() => {
    if (isRouterInitialized(router)) {
      if (debouncedTokenToSearch === '') {
        return
      }
      onSearch(router, debouncedTokenToSearch)
    }
  }, [debouncedTokenToSearch])

  return (
    <AutoComplete
      value={searchTerm}
      options={searchOptions}
      style={{
        flexGrow: 1,
        marginBottom: 4,
        marginTop: 4,
        marginLeft: 4,
      }}
      onSearch={(term: string) => {
        setSearchTerm(term)
      }}
      onSelect={onSelect(setSearchTerm)}
      onChange={(value) => {
        if (value === '') {
          onSearch(router, '')
        }
      }}
    >
      <Input
        className="transparent-addon"
        bordered={false}
        placeholder={t('searchbar.placeholder')}
        allowClear
        addonBefore={<SearchOutlined/>}
      />
    </AutoComplete>
  )
}

export default SearchInput

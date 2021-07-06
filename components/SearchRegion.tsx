import { FC, useState } from 'react'
import { useDebounce } from 'ahooks'
import { Select } from 'antd'
import useRegionRecommender from '../hooks/useRegionRecommender'
import { useRouter } from 'next/router'
import { convertQueryParamToString } from '../utils/utils'


const SearchRegion: FC = () => {
  const router = useRouter()
  const { query } = router

  const { dropdowns } = query
  const regionsGroup = convertQueryParamToString(dropdowns, 'main')

  const [regionNameToSearch, setRegionNameToSearch] = useState<string>('')
  const debouncedNameRegionToSearch = useDebounce(regionNameToSearch, { wait: 100 })

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
        console.log(term)
        setRegionNameToSearch(term)
      }}
      onSelect={(region) => {
        console.log(`selected: `, region)
      }}
      placeholder="Search for a region"
      style={{
        width: '100%',
        marginTop: 8,
      }}
    />
  )
}


export default SearchRegion
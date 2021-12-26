import { FC } from 'react'
import { useToggle } from 'ahooks'
import { Button } from 'antd'
import SearchFilters from './SearchFilters'
import SearchInput from './SearchInput'
import FilterOutlined from '@ant-design/icons/lib/icons/FilterOutlined'


const onShowFilters = (toggleShowFilters) => () => (toggleShowFilters())

const SearchControllers: FC = (_props) => {
  const [showFilters, { toggle: toggleShowFilters }] = useToggle('0', '1')

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginLeft: 8,
        marginRight: 4,
        marginTop: 8,
        marginBottom: 8,
      }}
    >
      {/* todo: make the search component a separate component to prevent unnecessary renders*/}
      <SearchInput/>

      <Button
        type="text"
        icon={
          <FilterOutlined/>
        }
        shape="round"
        onClick={onShowFilters(toggleShowFilters)}
        size="small"
      />

      <SearchFilters
        showFilters={showFilters}
      />
    </div>
  )
}

export default SearchControllers

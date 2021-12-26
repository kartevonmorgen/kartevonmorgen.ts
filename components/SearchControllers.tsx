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
    <div>
      {/* todo: make the search component a separate component to prevent unnecessary renders*/}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          // margin: 4
        }}
      >
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
      </div>

      <SearchFilters
        showFilters={showFilters}
      />
    </div>
  )
}

export default SearchControllers

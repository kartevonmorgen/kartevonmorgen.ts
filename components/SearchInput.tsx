import {Input} from 'antd'

const {Search} = Input


const SearchInput = () => (
  <Search
    placeholder="input search text"
    allowClear
    enterButton
    onSearch={() => {
    }}
  />
)

export default SearchInput
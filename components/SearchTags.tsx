import {FC} from 'react'
import {Select} from 'antd'

const {Option} = Select


interface SearchTagsProps {
  options: string[]
}

function handleChange(value) {
  console.log(`selected ${value}`)
}

const SearchTags: FC<SearchTagsProps> = (props) => (
  <Select
    mode="tags"
    style={{
      width: '100%',
      marginTop: 8
    }}
    placeholder="Search for Tags"
    onChange={handleChange}
  >
    {
      props.options.map((option, i) => (
        <Option
          key={`${option}-${i}`}
          value={option}
        >
          {option}
        </Option>
      ))
    }
  </Select>
)

SearchTags.defaultProps = {
  options: []
}

export default SearchTags
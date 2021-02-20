import { FC, Fragment, useEffect, useState } from 'react'

import { Select } from 'antd'
import { TagsCount } from '../dtos/TagCount'

const { Option } = Select


interface SearchTagsProps {
  optionsCount: TagsCount
}

function handleChange(value) {
  console.log(`selected ${value}`)
}

const SearchTags: FC<SearchTagsProps> = (props) => {
  // the ant select uses useLayout internally and we need to be sure it's mounted on the browser
  const [showSelect, setShowSelect] = useState<boolean>(false)
  useEffect(() => {
    setShowSelect(true)
  }, [])

  return (
    <Fragment>
      {showSelect && (
        <Select
          mode="tags"
          style={{
            width: '100%',
            marginTop: 8,
          }}
          placeholder="Search for Tags"
          onChange={handleChange}
        >
          {
            props.optionsCount.map((optionCount, i) => (
              <Option
                key={`${optionCount[0]}-${i}`}
                value={optionCount[0]}
              >
                {optionCount[0]}
              </Option>
            ))
          }
        </Select>
      )}
    </Fragment>
  )
}

SearchTags.defaultProps = {
  optionsCount: [],
}

export default SearchTags
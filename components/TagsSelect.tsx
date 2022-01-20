import { FC, useState } from 'react'
import { Select, SelectProps } from 'antd'
import { useDebounce } from 'ahooks'
import useTagMatcher from '../hooks/useTagMatcher'
import { MostPopularTagsParams } from '../pages/api/v0/entries/most-popular-tags'


const { Option } = Select


const TagsSelect: FC<SelectProps<any>> = (props) => {
  const {
    onSearch: onSearchCallback,
    onSelect: onSelectCallback,
    onDeselect: onDeselectCallback,
    onClear: onClearCallback,
    placeholder,
  } = props

  const [tokenToMatchTagsWith, setTokenToMatchTagsWith] = useState<string>('')
  const debouncedTokenToMatchTagsWith = useDebounce(tokenToMatchTagsWith, { wait: 100 })

  const tagMatcherParams: MostPopularTagsParams = {
    contains: debouncedTokenToMatchTagsWith,
  }
  const { data: matchedTagsWithFrequency } = useTagMatcher(tagMatcherParams)


  return (
    <Select
      {...props}
      mode="tags"
      allowClear
      style={{ width: '100%' }}
      placeholder={placeholder}
      onSearch={(input) => {
        setTokenToMatchTagsWith(input)
        onSearchCallback(input)
      }}
      onSelect={(value, option) => {
        setTokenToMatchTagsWith('')
        onSelectCallback(value, option)
      }}
      onDeselect={(value, option) => {
        setTokenToMatchTagsWith('')
        onDeselectCallback(value, option)
      }}
      onClear={() => {
        setTokenToMatchTagsWith('')
        onClearCallback()
      }}
    >
      {
        matchedTagsWithFrequency && (
          matchedTagsWithFrequency.map((tagWithFrequency) => (
            <Option
              key={`tag-input-${tagWithFrequency.tag}`}
              value={tagWithFrequency.tag}
            >
              {tagWithFrequency.tag}
            </Option>
          ))
        )
      }
    </Select>
  )
}


TagsSelect.defaultProps = {
  onSearch: (_input) => {
  },
  onSelect: (_value, _option) => {
  },
  onDeselect: (_value, _option) => {
  },
  onClear: () => {
  },
  placeholder: 'Tags',
}


export default TagsSelect

import React, { FC, useState } from 'react'
import { Checkbox, Form, Select, SelectProps } from 'antd'
import { useDebounce } from 'ahooks'
import useTagMatcher from '../hooks/useTagMatcher'
import { MostPopularTagsParams } from '../pages/api/v0/entries/most-popular-tags'
import { AxiosInstance } from '../api'
import { useRouter } from 'next/router'
import { BASICS_ENDPOINTS } from '../api/endpoints/BasicsEndpoints'
import { getProjectNameFromQuery } from '../utils/slug'


const { Option } = Select


const TagsSelect: FC<SelectProps<any>> = (props) => {

  const router = useRouter();
  const {query} = router;
  let group = getProjectNameFromQuery(query)

  const {
    onSearch: onSearchCallback,
    onSelect: onSelectCallback,
    onDeselect: onDeselectCallback,
    onClear: onClearCallback,
    placeholder,
  } = props

  const [tokenToMatchTagsWith, setTokenToMatchTagsWith] = useState<string>('')
  const debouncedTokenToMatchTagsWith = useDebounce(tokenToMatchTagsWith, { wait: 100 })
  const [tags, setTags] = useState<string[]>([])

  AxiosInstance.GetRequest(BASICS_ENDPOINTS.getTags() + `?group=${group}`).then(response => {
    if (Array.isArray(response.data)) {
      setTags(response.data)
    }
  });



  const tagMatcherParams: MostPopularTagsParams = {
    contains: debouncedTokenToMatchTagsWith,
  }
  const { data: matchedTagsWithFrequency } = useTagMatcher(tagMatcherParams)


  return (
    <div>
      <Checkbox.Group
        options={tags}
      />
      <Select
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
            matchedTagsWithFrequency.map(tagWithFrequency => (
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
    </div>
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
import { FC, useState } from 'react'
import {useRouter} from 'next/router'
import { Select, SelectProps } from 'antd'
import { useDebounce } from 'ahooks'
import useSearchRecommender from '../hooks/useSearchRecommender'
import { getProjectNameFromQuery } from '../utils/slug'


const { Option } = Select


const TagsSelect: FC<SelectProps<any>> = (props) => {
  const {
    onSearch: onSearchCallback,
    onSelect: onSelectCallback,
    onDeselect: onDeselectCallback,
    onClear: onClearCallback,
    placeholder,
  } = props

  const router = useRouter()
  const {query} = router
  const project = getProjectNameFromQuery(query)

  const [tokenToMatchTagsWith, setTokenToMatchTagsWith] = useState<string>('')
  const debouncedTokenToMatchTagsWith = useDebounce(tokenToMatchTagsWith, { wait: 100 })

  const options = useSearchRecommender(debouncedTokenToMatchTagsWith, project)

  return (
    <Select
      {...props}
      mode="tags"
      style={{ width: '100%' }}
      placeholder={placeholder}
      onSearch={(input) => {
        setTokenToMatchTagsWith(input)
        if (onSearchCallback) {
          onSearchCallback(input)
        }
      }}
      onSelect={(value, option) => {
        setTokenToMatchTagsWith('')
        if (onSelectCallback) {
          onSelectCallback(value, option)
        }
      }}
      onDeselect={(value, option) => {
        setTokenToMatchTagsWith('')
        if (onDeselectCallback) {
          onDeselectCallback(value, option)
        }
      }}
      onClear={() => {
        setTokenToMatchTagsWith('')
        if (onClearCallback) {
          onClearCallback()
        }
      }}
      options={options}
    />
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

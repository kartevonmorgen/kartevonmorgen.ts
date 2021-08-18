import React, { FC, useState } from 'react'
import { Checkbox, Form, Select, SelectProps } from 'antd'
import { useDebounce } from 'ahooks'
import useTagMatcher from '../hooks/useTagMatcher'
import { MostPopularTagsParams } from '../pages/api/v0/entries/most-popular-tags'
import { AxiosInstance } from '../api'
import { useRouter } from 'next/router'
import { BASICS_ENDPOINTS } from '../api/endpoints/BasicsEndpoints'
import { getProjectNameFromQuery } from '../utils/slug'
import { CheckboxValueType } from 'antd/es/checkbox/Group'


const { Option } = Select


const TagsSelect: FC<any> = (props) => {

  // Get data from URL
  const router = useRouter();
  const {query} = router;
  // Group is a parameter describing group of clients which use common .csv config file
  let group = getProjectNameFromQuery(query)

  const {
    onSearch: onSearchCallback,
    onSelect: onSelectCallback,
    onDeselect: onDeselectCallback,
    onClear: onClearCallback,
    placeholder,
  } = props

  let isFormPart = props.isFormPart ?? false

  let setTagsCallback = props.setTagsCallback

  if (!setTagsCallback) {
    console.warn("setTagsCallback is not a function! TagsSelect.tsx")
    setTagsCallback = (tags: string[]) => {}
  }

  const [tokenToMatchTagsWith, setTokenToMatchTagsWith] = useState<string>('')
  const debouncedTokenToMatchTagsWith = useDebounce(tokenToMatchTagsWith, { wait: 100 })

  // When only started it's true
  // After start it's false
  const [onStart, setOnStart] = useState<boolean>(true)

  // List of already selected tags
  let initialData = []

  // If we're starting setup initial data from props
  // (After start data from props will be no more actual so we have not use it then)
  if (onStart && props.initialData) {
    initialData = props.initialData
    setOnStart(false)
  }

  // List of all "special" tags - tags, which have to be shown in checkboxes
  const [tags, setTags] = useState<string[]>([])

  // List of currently selected tags
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData)

  // If we have no tags, get them from API
  if (tags.length === 0) {
    AxiosInstance.GetRequest(BASICS_ENDPOINTS.getTags() + `?group=${group}`).then(response => {
      if (Array.isArray(response.data)) {
        setTags(response.data)
      }
    });
  }

  // Make option object from tag
  let commonTagsOptions = []
  tags.forEach(tag => {
    commonTagsOptions.push({label: tag, value: tag})
  })

  const tagMatcherParams: MostPopularTagsParams = {
    contains: debouncedTokenToMatchTagsWith,
  }

  const { data: matchedTagsWithFrequency } = useTagMatcher(tagMatcherParams)

  // When some checkbox value is changed
  const onCheckboxChange = (checkedValues: string[]) => {
    // This will be the new value of selected tags
    let newSelectedTags = []

    // For each value which is selected in checkbox, we check if it was it already selected
    checkedValues.forEach(value => {
      // If it was not selected, but is selected now => add to the list and run callback
      if (!selectedTags.includes(value)) {
        // Usually options object is passed from Select, but when it's passed from checkbox
        // we have to generate options object again manually
        let options = {
          children: value,
          value: value,
          key: "tag-input-" + value
        }

        onSelectCallback(value, options)
        newSelectedTags.push(value)
      }
    })

    // Tags which are planned to be removed
    let tagsToRemove = []

    // For each tag which was selected before, check if it's still selected or should be removed
    selectedTags.forEach(tag => {
      // If it was selected but now is not selected - remove it from tagslist
      if (!checkedValues.includes(tag) && tags.includes(tag)) {
        let options = {
          children: tag,
          value: tag,
          key: "tag-input-" + tag
        }

        onDeselectCallback(tag, options)
        tagsToRemove.push(tag)
      }
    })

    // Reassemble selectedTags object
    selectedTags.forEach(tag => {
      if (!tagsToRemove.includes(tag)) {
        newSelectedTags.push(tag)
      }
    })
    // Renew selectedTags value on form data
    setTagsCallback(newSelectedTags)
    setSelectedTags(newSelectedTags)

  }



  // Event when some value is selected on input
  const onInputSelect = (value, option) => {
    let newSelectedTags = []

    // Run callback
    setTokenToMatchTagsWith('')

    if (selectedTags.includes(value)) {
      return
    }

    // Deep copy of array
    newSelectedTags = selectedTags.map(value => value)
    newSelectedTags.push(value)

    onSelectCallback(value, option)

    // Renew selectedTags value on form data
    setTagsCallback(newSelectedTags)
    setSelectedTags(newSelectedTags)
  }

  // Similar function on deselect
  const onInputDeselect = (value, option) => {
    console.log(option)
    let newSelectedTags = []

    selectedTags.forEach(tag => {
      if (tag != value) {
        newSelectedTags.push(tag)
      }
    })

    setTokenToMatchTagsWith('')
    onDeselectCallback(value, option)

    // Renew selectedTags value on form data
    setTagsCallback(newSelectedTags)
    setSelectedTags(newSelectedTags)
  }

  // clear all
  const clear = () => {
    setTokenToMatchTagsWith('')
    onClearCallback()
    setSelectedTags([])
  }

  let selectElement = <Select
    mode="multiple"
    allowClear
    style={{ width: '100%' }}
    placeholder={placeholder}
    onSearch={(input) => {
      setTokenToMatchTagsWith(input)
      onSearchCallback(input)
    }}
    onSelect={(value, option) => {
      onInputSelect(value, option)
    }}
    onDeselect={(value, option) => {
      onInputDeselect(value, option)
    }}
    onClear={() => {
      clear()
    }}
    value={selectedTags}
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

  return (
    <div>
      <Checkbox.Group
        className={"hashtag_checkbox_group"}
        options={commonTagsOptions}
        onChange={onCheckboxChange}
        value={selectedTags}
      />
      {
        isFormPart ?
          <Form.Item name="tags" validateStatus={'success'}>{selectElement}</Form.Item>
          :
          <div>{selectElement}</div>
      }

    </div>
  )
}


TagsSelect.defaultProps = {
  onSearch: (_input) => {
    console.warn("onSearch callback is not set!! Check TagsSelect")
  },
  onSelect: (_value, _option) => {
    console.warn("onSelect callback is not set!! Check TagsSelect")
  },
  onDeselect: (_value, _option) => {
    console.warn("onDeselect callback is not set!! Check TagsSelect")
  },
  onClear: () => {
    console.warn("onClear callback is not set!! Check TagsSelect")
  },
  initialData: [] as string[],
  placeholder: 'Tags',
}


export default TagsSelect
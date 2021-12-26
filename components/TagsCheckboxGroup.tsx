import { FC } from 'react'
import { useRouter } from 'next/router'
import { Checkbox, Space } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import useRequest from '../api/useRequest'
import { MainCheckboxesResponse } from '../pages/api/v0/checkboxes/[group]/main-checkboxes'
import API_ENDPOINTS from '../api/endpoints'
import { getProjectNameFromQuery } from '../utils/slug'


const SEP = ','

const areCheckboxValuesSelected = (valuesFromParent: string[], checkboxValues: string[]): boolean => {
  const allCheckboxValuesAreSelectedByParent: boolean = checkboxValues.every(
    (value) => valuesFromParent.includes(value),
  )

  return allCheckboxValuesAreSelectedByParent
}

interface TagsCheckboxGroup {
  onChange: (e: CheckboxChangeEvent) => void
  selectedValues: string[]
}

const TagsCheckboxGroup: FC<TagsCheckboxGroup> = (props) => {
  const { onChange, selectedValues: valuesFromParent } = props

  const router = useRouter()
  const { query } = router
  const projectName = getProjectNameFromQuery(query)

  const { data, error } = useRequest<MainCheckboxesResponse>({
    url: `${API_ENDPOINTS.getMainCheckboxes(projectName)}`,
  })

  if (!data) {
    return null
  }

  if (!data.hasData) {
    return null
  }

  if (error) {
    return null
  }

  const { data: labelValues } = data

  return (
    <div
      style={{
        marginTop: 4,
        marginBottom: 8,
      }}
    >
      <Space
        size="small"
        wrap
      >
        {
          labelValues.map((labelValue) => {
            const checkboxValues = labelValue.value.split(SEP)

            return (
              <Checkbox
                key={`tags-checkbox-${labelValue.label}`}
                value={checkboxValues}
                onChange={onChange}
                checked={areCheckboxValuesSelected(valuesFromParent, checkboxValues)}
              >
                {labelValue.label}
              </Checkbox>
            )
          })
        }
      </Space>
    </div>
  )
}


TagsCheckboxGroup.defaultProps = {
  onChange: (e) => {
  },
  selectedValues: [],
}

export default TagsCheckboxGroup

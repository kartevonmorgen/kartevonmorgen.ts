import { FC } from 'react'
import { useRouter } from 'next/router'
import { Checkbox, Space, Typography } from 'antd'
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

  // Sort: items without headline first, then group by headline
  const itemsWithoutHeadline = labelValues.filter((item) => !item.headline)
  const itemsWithHeadline = labelValues.filter((item) => item.headline)
  
  // Group items by headline
  const groupedByHeadline = itemsWithHeadline.reduce((acc, item) => {
    const headline = item.headline!
    if (!acc[headline]) {
      acc[headline] = []
    }
    acc[headline].push(item)
    return acc
  }, {} as Record<string, typeof itemsWithHeadline>)

  return (
    <div>
      <Space
        size="small"
        wrap
        style={{ marginBottom: '4px' }}
      >
        {/* Render checkboxes without headlines first */}
        {
          itemsWithoutHeadline.map((labelValue) => {
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
      
      {/* Render grouped checkboxes with headlines */}
      {
        Object.entries(groupedByHeadline).map(([headline, items]) => (
          <div key={`headline-${headline}`} style={{ marginBottom: '4px' }}>
            <div style={{ marginBottom: '2px' }}>
              <Typography.Text type="secondary">{headline}</Typography.Text>
            </div>
            <Space
              size="small"
              wrap
            >
              {
                items.map((labelValue) => {
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
        ))
      }
    </div>
  )
}


TagsCheckboxGroup.defaultProps = {
  onChange: (e) => {
  },
  selectedValues: [],
}

export default TagsCheckboxGroup

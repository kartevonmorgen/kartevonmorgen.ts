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

const groupLabelValuesByHeadline = (labelValues: any[]) => {
  const itemsWithoutHeadline: typeof labelValues = []
  const groupedByHeadline: Record<string, typeof labelValues> = {}
  let currentHeadline: string | null = null

  for (let i = 0; i < labelValues.length; i++) {
    const item = labelValues[i]
    
    if (item.headline) {
      // This item has a headline, update current headline and add to its group
      currentHeadline = item.headline
      if (!groupedByHeadline[item.headline]) {
        groupedByHeadline[item.headline] = []
      }
      groupedByHeadline[item.headline].push(item)
    } else {
      // This item doesn't have a headline
      if (currentHeadline !== null) {
        // We have a previous headline, add to that group
        groupedByHeadline[currentHeadline].push(item)
      } else {
        // No previous headline yet, add to ungrouped items
        itemsWithoutHeadline.push(item)
      }
    }
  }

  return { itemsWithoutHeadline, groupedByHeadline }
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

  const { itemsWithoutHeadline, groupedByHeadline } = groupLabelValuesByHeadline(labelValues)

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

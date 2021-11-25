import { FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { Checkbox, Space } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import useRequest from '../api/useRequest'
import { MainCheckboxesResponse } from '../pages/api/v0/checkboxes/[group]/main-checkboxes'
import API_ENDPOINTS from '../api/endpoints'
import { createSlugPathFromQueryAndRemoveSlug, getProjectNameFromQuery } from '../utils/slug'
import { convertArrayToQueryParam, convertQueryParamToArray, updateRoutingQuery } from '../utils/utils'


const SEP = ','


const addOrRemoveTagsFromQuery = (router: NextRouter) => (event: CheckboxChangeEvent) => {
  const { query } = router
  const { tag } = query

  const {
    target: {
      checked: isCheckboxChecked,
      value: tagsFromCheckbox,
    },
  } = event

  //
  const oldQueryTags: string[] = convertQueryParamToArray(tag)

  let newQueryTags: string[] = []
  if (isCheckboxChecked) {
    newQueryTags = [...oldQueryTags]
    tagsFromCheckbox.forEach(tag => {
      if (!oldQueryTags.includes(tag)) {
        newQueryTags.push(tag)
      }
    })
  } else {
    newQueryTags = oldQueryTags.filter(tag => !tagsFromCheckbox.includes(tag))
  }

  const newQueryParams = updateRoutingQuery(query, { tag: convertArrayToQueryParam(newQueryTags) })
  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  router.replace(
    {
      pathname: `/m/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )

}

interface TagsCheckboxGroup {

}

const TagsCheckboxGroup: FC<TagsCheckboxGroup> = (_props) => {

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
      }}
    >
      <Space
        size="middle"
        wrap
      >
        {
          labelValues.map((labelValue) => (
            <Checkbox
              key={`tags-checkbox-${labelValue.label}`}
              value={labelValue.value.split(SEP)}
              onChange={addOrRemoveTagsFromQuery(router)}
            >
              {labelValue.label}
            </Checkbox>
          ))
        }
      </Space>
    </div>
  )
}


export default TagsCheckboxGroup
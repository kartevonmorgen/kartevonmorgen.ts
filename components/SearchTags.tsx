import { FC, Fragment, useEffect, useState } from 'react'
import {useRouter, NextRouter} from 'next/router'

import { Select } from 'antd'
import { TagsCount } from '../dtos/TagCount'
import { removeRoutingQueryParams, updateRoutingQuery } from '../utils/utils'

const { Option } = Select


interface SearchTagsProps {
  optionsCount: TagsCount
}

const handleChange =  (router: NextRouter) =>  (values: string[]) => {
  const { query } = router

  const tagParamKey: string = 'tag'

  // if no tags is selected
  if (values.length === 0) {
    const newQueryParams = removeRoutingQueryParams(query, [tagParamKey])

    router.replace(
      {
        pathname: '/maps/[project]',
        query: newQueryParams,
      },
      undefined,
      { shallow: true },
    )

    return
  }

  const newQueryParams = updateRoutingQuery(query, {tag: values})
  router.replace(
    {
      pathname: '/maps/[project]',
      query: newQueryParams,
    },
    undefined,
    { shallow: true },
  )
}

const SearchTags: FC<SearchTagsProps> = (props) => {
  // the ant select uses useLayout internally and we need to be sure it's mounted on the browser
  const [showSelect, setShowSelect] = useState<boolean>(false)
  useEffect(() => {
    setShowSelect(true)
  }, [])

  const router = useRouter()

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
          onChange={handleChange(router)}
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
import { FC, Fragment } from 'react'
import { Select } from 'antd'
import { MostPopularTagsParams } from '../pages/api/v0/entries/most-popular-tags'
import useTagMatcher from '../hooks/useTagMatcher'


const { Option } = Select


interface TagSelectOptionsProps {
  token?: string
}

const TagSelectOptions: FC<TagSelectOptionsProps> = (props) => {
  const { token } = props

  const tagMatcherParams: MostPopularTagsParams = {
    contains: token,
  }
  const { data: matchedTagsWithFrequency, error } = useTagMatcher(tagMatcherParams)

  if (!matchedTagsWithFrequency) {
    return null
  }

  if (error) {
    //  todo: catch the error
    return null
  }

  return (
    <Fragment>
      {
        matchedTagsWithFrequency.map((tagWithFrequency) => (
          <Option
            key={`tag-input-${tagWithFrequency.tag}`}
            value={tagWithFrequency.tag}
          >
            {tagWithFrequency.tag}
          </Option>
        ))
      }
    </Fragment>
  )
}


TagSelectOptions.defaultProps = {
  token: '',
}


export default TagSelectOptions

import { FC, Fragment } from 'react'
import { TagArray } from '../dtos/Tag'
import { Divider, Space, Tag } from 'antd'
import { useRouter } from 'next/router'
import { setTagToRouterAndRedirectToMap } from '../utils/router'


interface EntryTagsProps {
  tags: TagArray
}

const EntityTags: FC<EntryTagsProps> = (props) => {
  const { tags } = props

  const router = useRouter()

  return (
    <Fragment>
      <Divider/>

      <Space
        size={3}
        wrap
      >
        {
          tags.map((tag) => (
            <Tag
              key={tag}
              className="kvm-tag"
              onClick={() => setTagToRouterAndRedirectToMap(tag, router)}
              style={{
                cursor: 'pointer',
              }}
            >
              {`#${tag}`}
            </Tag>),
          )
        }
      </Space>
    </Fragment>
  )
}

export default EntityTags

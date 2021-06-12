import React, { FC, Fragment } from 'react'
import { TagArray } from '../dtos/Tag'
import { Divider, Space, Tag } from 'antd'


interface EntryTagsProps {
  tags: TagArray
}

const EntityTags: FC<EntryTagsProps> = (props) => {
  const { tags } = props

  return (
    <Fragment>
      <Divider>Tags</Divider>

      <Space
        size="small"
        wrap
      >
        {
          tags.map((t) => (<Tag key={t}>{t}</Tag>))
        }
      </Space>
    </Fragment>
  )
}

export default EntityTags
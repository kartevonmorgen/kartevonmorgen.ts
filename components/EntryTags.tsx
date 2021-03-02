import { FC } from 'react'
import { TagArray } from '../dtos/Tag'
import { Space, Tag } from 'antd'


interface EntryTagsProps {
  tags: TagArray
}

const EntryTags: FC<EntryTagsProps> = (props) => {
  const { tags } = props

  return (
    <Space
      size="small"
      wrap
    >
      {
        tags.map((t) => (<Tag key={t}>{t}</Tag>))
      }
    </Space>
  )
}

export default EntryTags
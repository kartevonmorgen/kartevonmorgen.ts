import { FC } from 'react'
import { Tag, TagProps } from 'antd'


interface TypeTagProps extends TagProps {
  type: string
}

const TypeTag: FC<TypeTagProps> = ({ type, ...tagProps }) => {
  return (
    <Tag
      {...tagProps}
      className={`${type}-tag`}
    >
      {type}
    </Tag>
  )
}


export default TypeTag

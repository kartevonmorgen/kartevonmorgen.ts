import { FC } from 'react'
import { Tag, TagProps } from 'antd'
import useTranslation from 'next-translate/useTranslation'

interface TypeTagProps extends TagProps {
  type: string
}

const TypeTag: FC<TypeTagProps> = ({ type, ...tagProps }) => {
  const { t } = useTranslation('map')
  return (
    <Tag {...tagProps} className={`${type}-tag`}>
      {t(`category.${type}`) || type}
    </Tag>
  )
}


export default TypeTag

import { FC } from 'react'
import { Select } from 'antd'
import useTranslation from 'next-translate/useTranslation'
import Category, { Categories, CategoryToNameMapper } from '../dtos/Categories'


interface EntityChooserFormSelectsProps {
  onSelect: (value: any) => void,
  value: Category
  shouldCreateANewEntity: boolean
}

const EntityChooserFormSelects: FC<EntityChooserFormSelectsProps> = (props) => {
  const { onSelect, value, shouldCreateANewEntity } = props

  const { t } = useTranslation('map')

  if (!shouldCreateANewEntity && value === Category.EVENT) {
    return null
  }

  const options: Categories = [
    Category.INITIATIVE,
    Category.COMPANY
  ]

  if (shouldCreateANewEntity) {
    options.push(Category.EVENT)
  }

  return (
    <Select
      placeholder="Category"
      onSelect={onSelect}
      style={{
        width: '100%',
        marginTop: 8,
        marginBottom: 16,
      }}
      value={value}
    >
      {
        options.map((option) => (
          <Select.Option
            key={option}
            value={option}
          >
            {t(`entryForm.category.${CategoryToNameMapper[option]}`)}
          </Select.Option>
        ))
      }
    </Select>
  )
}


export default EntityChooserFormSelects

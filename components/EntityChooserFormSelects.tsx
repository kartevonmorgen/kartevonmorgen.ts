import { FC } from 'react'
import { Select } from 'antd'
import { SingleType } from 'rc-select/lib/interface/generator'
import startCase from 'lodash/startCase'
import Category, { Categories, CategoryToNameMapper } from '../dtos/Categories'


interface EntityChooserFormSelectsProps {
  onSelect: (value: SingleType<Category>) => void,
  value: Category
  shouldCreateANewEntity: boolean
}

const EntityChooserFormSelects: FC<EntityChooserFormSelectsProps> = (props) => {
  const { onSelect, value, shouldCreateANewEntity } = props

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
          <Select.Option value={option}>{startCase(CategoryToNameMapper[option])}</Select.Option>
        ))
      }
    </Select>
  )
}


export default EntityChooserFormSelects

import { Component } from 'react'

import { Tag } from 'antd'
import Category from '../dtos/Categories'

import {lime, green, magenta} from '@ant-design/colors'

const { CheckableTag } = Tag

interface Types {
  id: Category
  name: string
  color: string
}

const types: Types[] = [
  {
    id: Category.INITIATIVE,
    name: 'Initiative',
    color: lime.primary,
  },
  {
    id: Category.COMPANY,
    name: 'Company',
    color: green.primary,
  },
  {
    id: Category.EVENT,
    name: 'Event',
    color: magenta.primary,
  },
]

class TypeChooser extends Component {
  state = {
    selectedTags: [],
  }

  handleChange(tag, checked) {
    const { selectedTags } = this.state
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag)
    this.setState({ selectedTags: nextSelectedTags })
  }

  render() {
    const { selectedTags } = this.state
    return (
      <>
        {types.map(type => {
          const isChecked = selectedTags.indexOf(type.id) > -1
          return (
            <CheckableTag
              key={type.id}
              checked={isChecked}
              onChange={checked => this.handleChange(type.id, checked)}
              style={{
                backgroundColor: isChecked && type.color,
              }}
            >
              {type.name}
            </CheckableTag>
          )
        })}
      </>
    )
  }
}


export default TypeChooser

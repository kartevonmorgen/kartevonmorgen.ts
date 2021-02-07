import {Component} from 'react'

import {Tag} from 'antd'

const {CheckableTag} = Tag

const tagsData = ['Events', 'Initiatives', 'Companies']

class TypeChooser extends Component {
  state = {
    selectedTags: [],
  }

  handleChange(tag, checked) {
    const {selectedTags} = this.state
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag)
    this.setState({selectedTags: nextSelectedTags})
  }

  render() {
    const {selectedTags} = this.state
    return (
      <>
        {tagsData.map(tag => (
          <CheckableTag
            key={tag}
            checked={selectedTags.indexOf(tag) > -1}
            onChange={checked => this.handleChange(tag, checked)}
          >
            {tag}
          </CheckableTag>
        ))}
      </>
    )
  }
}


export default TypeChooser

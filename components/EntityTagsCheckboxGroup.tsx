import { Dispatch, FC, useEffect, useState } from 'react'
import { FormInstance } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import lodashUnion from 'lodash/union'
import TagsCheckboxGroup from './TagsCheckboxGroup'


interface EntityTagsCheckboxGroupProps {
  form: FormInstance
  selectedValues: string[]
}

const addOrRemoveTagsFromTagsSelect = (form: FormInstance, setSelectedValues: Dispatch<string[]>) => (e: CheckboxChangeEvent) => {
  const checkboxTags: string[] = e.target.value
  const oldTags: string[] = form.getFieldValue('tags')

  let newTags: string[] = []
  if (e.target.checked) {
    newTags = lodashUnion(oldTags, checkboxTags)
  } else {
    newTags = oldTags.filter((tag) => !checkboxTags.includes(tag))
  }

  form.setFieldsValue({ tags: newTags })
  setSelectedValues(newTags)
}

const EntityTagsCheckboxGroup: FC<EntityTagsCheckboxGroupProps> = (props) => {
  const { form, selectedValues: selectedValuesFromForm } = props

  const [selectedValues, setSelectedValues] = useState<string[]>([])

  useEffect(() => {
    setSelectedValues(selectedValuesFromForm)
  }, [selectedValuesFromForm])


  return (
    <TagsCheckboxGroup
      onChange={addOrRemoveTagsFromTagsSelect(form, setSelectedValues)}
      selectedValues={selectedValues}
    />
  )
}


export default EntityTagsCheckboxGroup

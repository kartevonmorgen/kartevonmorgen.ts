import { Dispatch, FC, useEffect, useState } from 'react'
import { FormInstance } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { useRouter } from 'next/router'
import lodashUnion from 'lodash/union'
import TagsCheckboxGroup from './TagsCheckboxGroup'
import { shouldShowBoxesOnMappingPage } from '../utils/router'


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

  const router = useRouter()
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  useEffect(() => {
    setSelectedValues(selectedValuesFromForm)
  }, [selectedValuesFromForm])

  // Check if boxes should be shown on mapping (entity form) page
  if (!shouldShowBoxesOnMappingPage(router)) {
    return null
  }

  return (
    <TagsCheckboxGroup
      onChange={addOrRemoveTagsFromTagsSelect(form, setSelectedValues)}
      selectedValues={selectedValues}
    />
  )
}


export default EntityTagsCheckboxGroup

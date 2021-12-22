import { FC, Fragment, useState } from 'react'
import { Form, FormInstance } from 'antd'
import useTranslation from 'next-translate/useTranslation'
import TagsSelect from './TagsSelect'
import EntityTagsCheckboxGroup from './EntityTagsCheckboxGroup'


interface EntityTagsFormSectionProps {
  form: FormInstance
}


const EntityTagsFormSection: FC<EntityTagsFormSectionProps> = (props) => {
  const { form } = props

  const { t } = useTranslation('map')

  const [selectedTags, setSelectedTags] = useState<string[]>([])

  return (
    <Fragment>

      <EntityTagsCheckboxGroup
        form={form}
        selectedValues={selectedTags}
      />

      {/* todo: add validation for the three tags*/}
      <Form.Item name="tags">
        <TagsSelect
          placeholder={t('entryForm.tags')}
          onSelect={(_value, _option) => setSelectedTags(form.getFieldValue('tags'))}
          onDeselect={(_value, _option) => setSelectedTags(form.getFieldValue('tags'))}
          onClear={() => setSelectedTags([])}
        />
      </Form.Item>
    </Fragment>
  )
}


export default EntityTagsFormSection

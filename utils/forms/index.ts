import update from 'immer'
import isUndefined from 'lodash/isUndefined'
import has from 'lodash/has'
import clone from 'lodash/clone'


interface DefaultValues {
  [key: string]: any,
}


export const setFormFieldsToDefaultOrNull = <T>(
  originalFormFields: T,
  defaultValues: DefaultValues,
): T => {

  const formFieldsWithDefaultValuesOrNull = update(originalFormFields, draft => {
    Object.keys(draft).forEach(k => {
      if (isUndefined(draft[k])) {
        if (has(defaultValues, k)) {
          draft[k] = clone(defaultValues[k])

          return
        }

        draft[k] = null
      }
    })
  })

  return formFieldsWithDefaultValuesOrNull
}

////////////////////////////

interface TransformationRuleSet {
  [key: string]: (originalValue: any) => any
}

interface FieldsNameMapper {
  [key: string]: string
}

export const transformFormValuesWithRules = <T>(
  originalFormFields: T,
  transformationRuleSet: TransformationRuleSet = {},
  fieldsToRename: FieldsNameMapper = {},
): T => {

  const transformedFields = update(originalFormFields, draft => {
    Object.keys(transformationRuleSet).forEach(fieldName => {
      const originalFieldValue = draft[fieldName]
      const fieldTransformer = transformationRuleSet[fieldName]
      const transformedValue = fieldTransformer(originalFieldValue)
      draft[fieldName] = transformedValue
    })
  })

  const renamedTransformedFields = update(transformedFields, (draft) => {
    Object.keys(fieldsToRename).forEach(originalFieldName => {
      const value = draft[originalFieldName]
      const newFieldName = fieldsToRename[originalFieldName]
      draft[newFieldName] = value
      delete draft[originalFieldName]
    })
  })

  return renamedTransformedFields
}
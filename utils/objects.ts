import update from 'immer'
import cloneDeep from 'lodash/cloneDeep'
import includes from 'lodash/includes'
import isUndefined from 'lodash/isUndefined'
import has from 'lodash/has'


export interface DefaultValues {
  [key: string]: any
}

export interface PropertyMapper {
  [key: string]: string
}

export type Transformer = (originalValue: any, originalObject: any) => any

export interface TransformerRuleSet {
  [originalPropertyName: string]: Transformer
}

export interface TransformerWithNewName {
  transformer: Transformer
  originalPropertyName?: string
}

export interface TransformerWithNewNameRuleSet {
  [newPropertyName: string]: TransformerWithNewName
}

export type propertyArray = string[]

export const transformObject = <T>(
  originalObject: T,
  transformationRuleSet: TransformerRuleSet,
): T => {
  return update(originalObject, draft => {
    Object.keys(transformationRuleSet).forEach(property => {
      const transformer = transformationRuleSet[property]
      const originalValue = originalObject[property]

      draft[property] = transformer(originalValue, originalObject)
    })
  })
}

export const removeProperties = <T>(originalObject: T, propertiesToRemove: propertyArray = []): T => {
  return update(originalObject, draft => {
    propertiesToRemove.forEach(property => {
      delete draft[property]
    })
  })
}

export const renameProperties = <T>(originalObject: T, propertiesToRename: PropertyMapper): T => {
  return update(originalObject, draft => {
    Object.keys(propertiesToRename).forEach(oldPropertyName => {
      const value = originalObject[oldPropertyName]
      const newPropertyName = propertiesToRename[oldPropertyName]

      draft[newPropertyName] = cloneDeep(value)
      delete draft[oldPropertyName]
    })
  })
}


export const collectProperties = <T>(originalObject: T, propertiesToKeep: propertyArray): Partial<T> => {
  const propertiesToRemove = Object.keys(originalObject).filter(property => !includes(propertiesToKeep, property))

  return removeProperties(originalObject, propertiesToRemove)
}

export const addPropertiesWithNewName = <T>(
  originalObject: T,
  transformerWithNewNameRuleSet: TransformerWithNewNameRuleSet,
): T => {
  return update(originalObject, draft => {
    Object.keys(transformerWithNewNameRuleSet).forEach(newPropertyName => {
      const { transformer, originalPropertyName } = transformerWithNewNameRuleSet[newPropertyName]
      let originalValue = null
      if (originalPropertyName) {
        originalValue = originalObject[originalPropertyName]
      }

      // the mutable objects are always headaches, we clone anyway to prevent unpredictability
      draft[newPropertyName] = transformer(cloneDeep(originalValue), originalObject)
    })
  })
}

export const setValuesToDefaultOrNull = <T>(originalObject: T, defaultValues: DefaultValues): T => {
  return update(originalObject, draft => {
    Object.keys(draft).forEach(k => {
      if (isUndefined(draft[k])) {
        if (has(defaultValues, k)) {
          draft[k] = cloneDeep(defaultValues[k])

          return
        }

        draft[k] = null
      }
    })
  })
}
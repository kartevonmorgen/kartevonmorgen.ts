import {Draft, produce} from 'immer'
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

export const transformObject = <T extends object>(
  originalObject: T,
  transformationRuleSet: TransformerRuleSet,
): T => {
  return produce(originalObject, draft => {
    Object.keys(transformationRuleSet).forEach(property => {
      const transformer = transformationRuleSet[property]
      const originalValue = originalObject[property as keyof T]

      draft[property as keyof Draft<T>] = transformer(originalValue, originalObject)
    })
  })
}

export const removeProperties = <T extends object>(originalObject: T, propertiesToRemove: propertyArray = []): T => {
  return produce(originalObject, draft => {
    propertiesToRemove.forEach(property => {
      delete draft[property as keyof Draft<T>]
    })
  })
}

export const renameProperties = <T>(originalObject: T, propertiesToRename: PropertyMapper): T => {
  return produce(originalObject, draft => {
    Object.keys(propertiesToRename).forEach(oldPropertyName => {
      const value = originalObject[oldPropertyName as keyof T]
      const newPropertyName = propertiesToRename[oldPropertyName]

      // @ts-ignore
      draft[newPropertyName] = cloneDeep(value)
      delete draft[oldPropertyName as keyof Draft<T>]
    })
  })
}


export const collectProperties = <T extends object>(originalObject: T, propertiesToKeep: propertyArray): Partial<T> => {
  const propertiesToRemove = Object.keys(originalObject).filter(property => !includes(propertiesToKeep, property))

  return removeProperties(originalObject, propertiesToRemove)
}

export const addPropertiesWithNewName = <T extends object>(
  originalObject: T,
  transformerWithNewNameRuleSet: TransformerWithNewNameRuleSet,
): T => {
  return produce(originalObject, draft => {
    Object.keys(transformerWithNewNameRuleSet).forEach(newPropertyName => {
      const { transformer, originalPropertyName } = transformerWithNewNameRuleSet[newPropertyName]
      let originalValue = null
      if (originalPropertyName) {
        originalValue = originalObject[originalPropertyName as keyof T]
      }

      // the mutable objects are always headaches, we clone anyway to prevent unpredictability
      draft[newPropertyName as keyof Draft<T>] = transformer(cloneDeep(originalValue), originalObject)
    })
  })
}

export const setValuesToDefaultOrNull = <T extends object>(originalObject: T, defaultValues: DefaultValues): T => {
  return produce(originalObject, draft => {
    Object.keys(draft).forEach(k => {
      if (isUndefined(draft[k as keyof Draft<T>])) {
        if (has(defaultValues, k)) {
          draft[k as keyof Draft<T>] = cloneDeep(defaultValues[k])

          return
        }

        // @ts-ignore
        draft[k as keyof Draft<T>] = null
      }
    })
  })
}

import isString from 'lodash/isString'


export const convertQueryParamToString = (stringOrArrayOfStrings: string | string[]): string => {
  if (isString(stringOrArrayOfStrings)) {
    return stringOrArrayOfStrings
  }

  if (stringOrArrayOfStrings.length === 0) {
    return ''
  }

  return stringOrArrayOfStrings[0]
}

export const convertStringToFloat = (str: string): number => {
  const result = parseFloat(str)
  if (isNaN(result)) {
    return 0.0
  }

  return result
}

export const convertQueryParamToFloat = (param: string | string[]): number => (
  convertStringToFloat(
    convertQueryParamToString(param),
  )
)
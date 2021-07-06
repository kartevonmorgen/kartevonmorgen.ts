export interface SelectOption {
  label: string
  value: string
  bold: boolean
  underline: boolean
  italic: boolean
  fontSize: number
}

export type SelectOptions = SelectOption[]
export type SingleGroupOfCategorySelectOptions = [string, SelectOptions]
export type GroupedCSelectOptions = SingleGroupOfCategorySelectOptions[]
// headline, records
export type BucketOfSelectOptions = [string, SelectOptions]
export type BucketsOfSelectOptions = BucketOfSelectOptions[]
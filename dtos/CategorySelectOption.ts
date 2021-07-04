export interface CategorySelectOption {
  label: string
  value: string
  bold: boolean
  underline: boolean
  italic: boolean
  fontSize: number
  icon: string
}

export type CategorySelectOptions = CategorySelectOption[]
export type SingleGroupOfCategorySelectOptions = [string, CategorySelectOptions]
export type GroupedCategorySelectOptions = SingleGroupOfCategorySelectOptions[]
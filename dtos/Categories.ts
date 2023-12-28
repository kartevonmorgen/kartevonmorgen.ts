enum Category {
  INITIATIVE = '2cd00bebec0c48ba9db761da48678134',
  EVENT = 'c2dc278a2d6a4b9b8a50cb606fc017ed',
  COMPANY = '77b3c33a92554bcf8e8c2c86cedd6f6f',
  UNKNOWN = 'UNKNOWN'
}

export const CategoryToNameMapper: Record<Category, string> = {
  [Category.INITIATIVE]: 'initiative',
  [Category.EVENT]: 'event',
  [Category.COMPANY]: 'company',
  [Category.UNKNOWN]: 'unknown',
}

export const CategoryNameToIdMapper: Record<string, Category> = Object.keys(CategoryToNameMapper).reduce(
  (mappedObjects, categoryId) => {

    mappedObjects[CategoryToNameMapper[categoryId as Category]] = categoryId as Category

    return mappedObjects
  },
  {} as Record<string, Category>)

export const knownCategories = Object.values(Category).filter(category => category !== Category.UNKNOWN)
export const knownCategoryNames = Object.values(knownCategories).map(categoryId => CategoryToNameMapper[categoryId])


export type Categories = Category[]

export type EntryCategoryTypes = Category.COMPANY | Category.INITIATIVE

export const EntryCategories = [
  Category.COMPANY,
  Category.INITIATIVE,
]

const EntryCategoryNames = [
  CategoryToNameMapper[Category.COMPANY],
  CategoryToNameMapper[Category.INITIATIVE],
]

const EventCategory = Category.EVENT

export const isEntryCategory = (categoryName: string): boolean => (EntryCategoryNames.includes(categoryName))
export const isEventCategory = (categoryName: string): boolean => (categoryName === EventCategory)

export default Category

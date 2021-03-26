enum Category {
  INITIATIVE = '2cd00bebec0c48ba9db761da48678134',
  EVENT = 'c2dc278a2d6a4b9b8a50cb606fc017ed',
  COMPANY = '77b3c33a92554bcf8e8c2c86cedd6f6f',
  UNKNOWN = 'UNKNOWN'
}

export type Categories = Category[]


const EntryCategories = [Category.COMPANY, Category.INITIATIVE]
const EventCategory = Category.EVENT

export const isEntryCategory = (id: string): boolean => (EntryCategories.includes(id as Category))
export const isEventCategory = (id: string): boolean => (id === EventCategory)

export default Category
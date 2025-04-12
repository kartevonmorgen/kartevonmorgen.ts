// todo: should eliminate self_api because it causes troubles with the hosting domain


// todo: use SWR instead
export const BASICS_API_URL: string | undefined = process.env.NEXT_PUBLIC_BASICS_API
export const SELF_API_URL: string | undefined= process.env.NEXT_PUBLIC_SELF_API
<<<<<<< HEAD
export const SELF_DOMAIN: string | undefined = process.env.NEXT_PUBLIC_SELF_DOMAIN
=======
export const WORKFLOW_API_URL: string | undefined = process.env.NEXT_PUBLIC_WORKFLOW_API
>>>>>>> 66bb6f6caf631537eec3896a2f2e2cf75d552e2c


export const BASICS_ENDPOINTS = {
  getMapPageConfigs: (project: string): string => `${SELF_API_URL}/maps/${project}/config`,
  getBurgerMenuLinks: (project: string): string => `${SELF_API_URL}/maps/${project}/config/burger-menu`,
  getPopularTags: (): string => `${SELF_API_URL}/entries/most-popular-tags`,
  searchEntries: (): string => `${BASICS_API_URL}/search`,
  searchEvents: (): string => `${BASICS_API_URL}/events`,
  getEntries: (): string => `${BASICS_API_URL}/entries`,
  getRatings: (): string => `${BASICS_API_URL}/ratings`,
  getEvent: (): string => `${BASICS_API_URL}/events`,
  postEvent: (): string => `${BASICS_API_URL}/events`,
  postEntries: (): string => `${BASICS_API_URL}/entries`,
  getCategories: (group: string): string => `${SELF_API_URL}/dropdowns/${group}/categories`,
  getRegions: (group: string): string => `${SELF_API_URL}/dropdowns/${group}/regions`,
  postEntryRating: (): string => `${BASICS_API_URL}/ratings`,
  getMainCheckboxes: (group: string): string => `${SELF_API_URL}/checkboxes/${group}/main-checkboxes`,
  getTagMarkerColors: (project: string): string => `${SELF_API_URL}/maps/${project}/tags/markers/colors`,
  postSubscription: (): string => `${SELF_DOMAIN}/workflows/v1/subscribe`,
  getVersion: (): string => `${SELF_API_URL}/version`,
}

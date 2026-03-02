// todo: should eliminate self_api because it causes troubles with the hosting domain


// todo: use SWR instead
export const BASICS_API_URL: string | undefined = process.env.NEXT_PUBLIC_BASICS_API
export const SELF_API_URL: string | undefined= process.env.NEXT_PUBLIC_SELF_API
export const SELF_DOMAIN: string | undefined = process.env.NEXT_PUBLIC_WORKFLOW_API
export const OFDB_ENTRY_ARCHIVE_URL: string | undefined = process.env.NEXT_PUBLIC_OFDB_ENTRY_ARCHIVE_URL
export const OFDB_EVENT_ARCHIVE_URL: string | undefined = process.env.NEXT_PUBLIC_OFDB_EVENT_ARCHIVE_URL


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
  postSubscription: (): string => `${SELF_DOMAIN}/v1/subscriptions`,
  getVersion: (): string => `${SELF_API_URL}/version`,
}

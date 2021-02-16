export const BASICS_API_URL: string = process.env.NEXT_PUBLIC_BASICS_API
export const SELF_API_URL: string = process.env.NEXT_PUBLIC_SELF_API


export const BASICS_ENDPOINTS = {
  getMapPageConfigs: (project:string): string => `${SELF_API_URL}/maps/${project}/config`,
  searchEntries: (): string => `${BASICS_API_URL}/search`,
  searchEvents: (): string => `${BASICS_API_URL}/events`,
}

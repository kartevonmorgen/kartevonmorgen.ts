export const OFDB_API_URL: string = process.env.NEXT_PUBLIC_OFDB_API


export const OFDB_ENDPOINTS = {
  getOFDBEntry: (): string => (`${OFDB_API_URL}/entries`),
  getOFDBEvent: (): string => (`${OFDB_API_URL}/events`),
}
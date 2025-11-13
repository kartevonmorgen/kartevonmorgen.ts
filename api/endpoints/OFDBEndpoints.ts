import { BASICS_API_URL } from './BasicsEndpoints'


export const OFDB_ENDPOINTS = {
  getOFDBEntry: (): string => (`${BASICS_API_URL}/entries`),
  getOFDBEvent: (): string => (`${BASICS_API_URL}/events`),
}

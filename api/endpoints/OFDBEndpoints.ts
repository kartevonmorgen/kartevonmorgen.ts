import { BASICS_API_URL, OFDB_ENTRY_ARCHIVE_URL, OFDB_EVENT_ARCHIVE_URL } from './BasicsEndpoints'


export const OFDB_ENDPOINTS = {
  getOFDBEntry: (): string => (`${BASICS_API_URL}/entries`),
  getOFDBEvent: (): string => (`${BASICS_API_URL}/events`),
  getOFDBEntryArchive: (): string => (OFDB_ENTRY_ARCHIVE_URL || `${BASICS_API_URL}/entries`),
  getOFDBEventArchive: (): string => (OFDB_EVENT_ARCHIVE_URL || `${BASICS_API_URL}/events`),
}

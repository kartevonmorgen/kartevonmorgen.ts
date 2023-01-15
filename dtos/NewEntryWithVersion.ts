import { NewEntry } from './NewEntry'


export interface NewEntryWithVersion extends NewEntry {
  version?: number
}
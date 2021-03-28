import { NewEntryWithLicense } from './NewEntryWithLicense'
import { NewEntryWithVersion } from './NewEntryWithVersion'


export interface Entry extends NewEntryWithLicense, NewEntryWithVersion {
  created?: number
  id?: string
  ratings?: string[]
}

export type Entries = Entry[]

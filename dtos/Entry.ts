import { NewEntryWithLicense } from './NewEntryWithLicense'
import { NewEntryWithVersion } from './NewEntryWithVersion'
import { SearchEntryID } from './SearchEntry'


export interface Entry extends NewEntryWithLicense, NewEntryWithVersion {
  created: number
  id?: SearchEntryID
  ratings?: string[]
}

export type Entries = Entry[]

import { FC } from 'react'
import { useRouter } from 'next/router'
import { getSlugActionFromQuery } from '../utils/slug'
import { SlugVerb } from '../utils/types'
import EntryDetail from './EntryDetail'
import EntryForm from './EntryForm'


const Entry: FC = () => {
  const router = useRouter()
  const { query } = router

  const slugAction = getSlugActionFromQuery(query)

  switch (slugAction.verb) {
    case SlugVerb.SHOW:
      return <EntryDetail/>
    case SlugVerb.CREATE:
      return <EntryForm/>
    case SlugVerb.EDIT:
      return <EntryForm/>
    default:
      // redirect to the result page
      return null
  }
}


export default Entry
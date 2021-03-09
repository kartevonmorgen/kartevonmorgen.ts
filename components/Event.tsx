import { useRouter } from 'next/router'
import { getSlugActionFromQuery } from '../utils/slug'
import { SlugVerb } from '../utils/types'
import EventDetail from './EventDetail'
import EventForm from './EventForm'
import EntryForm from './EntryForm'


const Event = () => {
  const router = useRouter()
  const { query } = router

  const slugAction = getSlugActionFromQuery(query)

  switch (slugAction.verb) {
    case SlugVerb.SHOW:
      return <EventDetail eventId={slugAction.id}/>
    case SlugVerb.CREATE:
      // return <EventForm/>
      return <EntryForm/>
    case SlugVerb.EDIT:
      return <EventForm/>
    default:
      // redirect to the result page
      return null
  }
}


export default Event
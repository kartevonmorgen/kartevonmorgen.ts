import { useRouter } from 'next/router'
import { getSlugActionFromQuery } from '../utils/slug'
import { SlugVerb } from '../utils/types'
import EventDetail from './EventDetail'
import EntityForm from './EntityForm'
import Category from '../dtos/Categories'


const Event = () => {
  const router = useRouter()
  const { query } = router

  const slugAction = getSlugActionFromQuery(query)

  switch (slugAction.verb) {
    case SlugVerb.SHOW:
      return <EventDetail eventId={slugAction.id}/>
    case SlugVerb.CREATE:
      return <EntityForm
        action={SlugVerb.CREATE}
      />
    case SlugVerb.EDIT:
      return <EntityForm
        category={Category.EVENT}
        action={SlugVerb.EDIT}
      />
    default:
      // redirect to the result page
      return null
  }
}


export default Event
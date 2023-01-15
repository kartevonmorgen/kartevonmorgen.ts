import { FC } from 'react'
import { SlugAction, SlugVerb } from '../utils/types'
import EventDetail from './EventDetail'
import EntityChooserForm from './EntityChooserForm'
import Category from '../dtos/Categories'


interface EventProps {
  slugAction: SlugAction
}


const Event: FC<EventProps> = (props) => {
  const { slugAction } = props

  switch (slugAction.verb) {
    case SlugVerb.SHOW:
      return <EventDetail eventId={slugAction.id}/>
    case SlugVerb.CREATE:
      return <EntityChooserForm
        verb={SlugVerb.CREATE}
      />
    case SlugVerb.EDIT:
      return <EntityChooserForm
        category={Category.EVENT}
        verb={SlugVerb.EDIT}
        entityId={slugAction.id}
      />
    default:
      // redirect to the result page
      return null
  }
}


export default Event

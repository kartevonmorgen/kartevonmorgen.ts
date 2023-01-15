import { FC } from 'react'
import { SlugAction, SlugVerb } from '../utils/types'
import EntryDetail from './EntryDetail'
import EntityChooserForm from './EntityChooserForm'
import Category from '../dtos/Categories'
import EntryChild from './EntryChild'


interface EntryProps {
  slugAction: SlugAction
}


const Entry: FC<EntryProps> = (props) => {
  const { slugAction } = props
  const { subSlugAction } = slugAction

  if (subSlugAction !== null) {
    return <EntryChild slugAction={subSlugAction}/>
  }

  switch (slugAction.verb) {
    case SlugVerb.SHOW:
      return <EntryDetail entryId={slugAction.id}/>
    case SlugVerb.CREATE:
      return <EntityChooserForm
        verb={SlugVerb.CREATE}
      />
    case SlugVerb.EDIT:
      return <EntityChooserForm
        verb={SlugVerb.EDIT}
        entityId={slugAction.id}
        category={Category.INITIATIVE}
      />
    default:
      // todo: redirect to the result page
      return null
  }
}


export default Entry

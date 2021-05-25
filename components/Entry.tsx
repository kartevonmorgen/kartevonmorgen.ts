import { FC } from 'react'
import { useRouter } from 'next/router'
import { getSlugActionFromQuery } from '../utils/slug'
import { SlugVerb } from '../utils/types'
import EntryDetail from './EntryDetail'
import EntityChooserForm from './EntityChooserForm'
import Category from '../dtos/Categories'


const Entry: FC = () => {
  const router = useRouter()
  const { query } = router

  const slugAction = getSlugActionFromQuery(query)

  switch (slugAction.verb) {
    case SlugVerb.SHOW:
      return <EntryDetail entryId={slugAction.id}/>
    case SlugVerb.CREATE:
      return <EntityChooserForm
        action={SlugVerb.CREATE}
      />
    case SlugVerb.EDIT:
      return <EntityChooserForm
        category={Category.INITIATIVE}
        action={SlugVerb.EDIT}
      />
    default:
      // redirect to the result page
      return null
  }
}


export default Entry
import { FC } from 'react'
import { SlugAction, SlugVerb } from '../utils/types'
import EntryRatingChild from './EntryRatingChild'
import EntryRatingForm from './EntryRatingForm'


interface EntryRatingProps {
  slugAction: SlugAction
}


const EntryRating: FC<EntryRatingProps> = (props) => {
  const { slugAction } = props
  const { subSlugAction } = slugAction

  const {
    parentSlugAction: {
      id: entryId,
    },
  } = slugAction

  if (subSlugAction !== null) {
    return (
      <EntryRatingChild
        slugAction={subSlugAction}
      />
    )
  }

  switch (slugAction.verb) {
    case SlugVerb.CREATE:
      return (
        <EntryRatingForm
          verb={SlugVerb.CREATE}
          entryId={entryId}
        />
      )
    case SlugVerb.EDIT:
      return (
        <EntryRatingForm
          verb={SlugVerb.EDIT}
          entryId={entryId}
        />
      )
    default:
      return null
  }
}


export default EntryRating

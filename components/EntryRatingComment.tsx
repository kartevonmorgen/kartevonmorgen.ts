import { FC } from 'react'
import { SlugAction, SlugVerb } from '../utils/types'
import EntryRatingCommentForm from './EntryRatingCommentForm'


interface EntryRatingCommentProps {
  slugAction: SlugAction
}


const EntryRatingComment: FC<EntryRatingCommentProps> = (props) => {
  const { slugAction } = props

  const { parentSlugAction } = slugAction
  const { parentSlugAction: grandParentSlugAction } = parentSlugAction

  const { id: entryId } = grandParentSlugAction
  const { id: ratingId } = parentSlugAction

  switch (slugAction.verb) {
    case SlugVerb.CREATE:
      return <EntryRatingCommentForm
        verb={SlugVerb.CREATE}
        entryId={entryId}
        ratingId={ratingId}
      />
    default:
      return null
  }
}


export default EntryRatingComment

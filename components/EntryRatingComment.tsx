import { FC } from 'react'
import { SlugAction, SlugVerb } from '../utils/types'
import EntryRatingCommentForm from './EntryRatingCommentForm'


interface EntryRatingCommentProps {
  slugAction: SlugAction
}


const EntryRatingComment: FC<EntryRatingCommentProps> = (props) => {
  const { slugAction } = props

  const { parentSlugAction } = slugAction
  const grandParentSlugAction = parentSlugAction?.parentSlugAction

  const entryId = grandParentSlugAction?.id
  const ratingId = parentSlugAction?.id

  switch (slugAction.verb) {
    case SlugVerb.CREATE:
      return <EntryRatingCommentForm
        verb={SlugVerb.CREATE}
        entryId={entryId as string}
        ratingId={ratingId as string}
      />
    default:
      return null
  }
}


export default EntryRatingComment

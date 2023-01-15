import { FC } from 'react'
import { RatingSlugEntity, SlugAction } from '../utils/types'
import EntryRatingComment from './EntryRatingComment'


interface EntryRatingChild {
  slugAction: SlugAction
}


const EntryRatingChild: FC<EntryRatingChild> = (props) => {
  const { slugAction } = props

  switch (slugAction.entity) {
    case RatingSlugEntity.COMMENT:
      return <EntryRatingComment slugAction={slugAction}/>
    default:
      return null
  }
}


export default EntryRatingChild

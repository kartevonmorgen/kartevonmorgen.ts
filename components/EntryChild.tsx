import { FC } from 'react'
import { EntrySlugEntity, SlugAction } from '../utils/types'
import EntryRating from './EntryRating'


interface EntryChildProps {
  slugAction: SlugAction
}


const EntryChild: FC<EntryChildProps> = (props) => {
  const { slugAction } = props

  // note: i know it's a switch with only one case but i developed that to make further developments easy
  switch (slugAction.entity) {
    case EntrySlugEntity.RATING:
      return <EntryRating slugAction={slugAction}/>
    default:
      return null
  }
}


export default EntryChild

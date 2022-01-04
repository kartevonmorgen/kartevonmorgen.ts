import { FC, Fragment } from 'react'
import { RatingComment } from '../dtos/RatingComment'
import { Comment, Typography } from 'antd'


const { Text } = Typography

interface EntityRatingCommentsProps {
  comments: RatingComment[]
}


const EntityRatingComments: FC<EntityRatingCommentsProps> = (props) => {

  const { comments } = props

  return (
    <Fragment>
      {
        comments.map((comment) => (
          <Comment
            key={`comment-${comment.id}`}
            content={<Text>{comment.text}</Text>}
          />
        ))
      }
    </Fragment>
  )
}


export default EntityRatingComments
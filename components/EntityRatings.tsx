import { FC } from 'react'
import toString from 'lodash/toString'
import groupBy from 'lodash/groupBy'
import { Comment, Divider, Typography } from 'antd'
import useTranslation from 'next-translate/useTranslation'
import { Rating } from '../dtos/Rating'
import { RatingsRequest } from '../dtos/RatingsRequest'
import useRequest from '../api/useRequest'
import API_ENDPOINTS from '../api/endpoints'
import FlowerLeafWithCanvas from './FlowerLeafWithCanvas'
import { RatingFactor } from '../dtos/RatingFactor'
import AddEntityRatingButton from './AddEntityRatingButton'
import AddEntityRatingCommentButton from './AddEntityRatingCommentButton'
import EntityRatingContent from './EntityRatingContent'
import EntityRatingComments from './EntityRatingComments'


const { Title } = Typography


interface EntityCommentsProps {
  ratingsIds: string[]
}


const EntityRatings: FC<EntityCommentsProps> = (props) => {
  const { ratingsIds } = props
  const hasRatings = ratingsIds.length !== 0


  const { t } = useTranslation('map')

  // the hooks should be at the top level before any kind of returns
  // so we have to make have the useRequest any way, but we'll make it conditional
  // to prevent unnecessary calls
  const ratingsRequest: RatingsRequest = {
    ids: toString(ratingsIds),
  }
  const { data: ratings, error: ratingsError } = useRequest<Rating[]>(
    hasRatings &&
    {
      url: `${API_ENDPOINTS.getRatings()}/${ratingsRequest.ids}`,
    },
  )

  // has no comment at all
  if (!hasRatings) {
    return <AddEntityRatingButton/>
  }

  if (ratingsError) {
    // todo: show error notification
    return null
  }

  // is loading
  if (!ratings) {
    // todo: make an spinner for loading
    return null
  }

  const groupedRatings = groupBy(ratings, 'context')
  const sortedContexts = Object.keys(groupedRatings).sort() as RatingFactor[]

  return (
    <div>
      {
        sortedContexts.map((context, _i) => {
          const contextRatings: Rating[] = groupedRatings[context]

          return (
            <div key={`groupRatings-${context}`}>
              <Title
                className={context}
                style={{
                  marginBottom: 0,
                }}
                level={5}
              >
                {t(`ratings.contextName.${context}`)}
              </Title>
              <Divider
                className="kvm-rating-divider"
                style={{
                  borderTopColor: 'rgb(221, 221, 221)',
                }}
                orientation="right"
              >
                <FlowerLeafWithCanvas ratingFactor={context}/>
              </Divider>

              {
                contextRatings.map((contextRating: Rating) => {
                  const [rootComment, ...comments] = contextRating.comments

                  return (
                    <Comment
                      key={`comment-${rootComment.id}`}
                      style={{
                        marginBottom: 8,
                      }}
                      actions={[<AddEntityRatingCommentButton ratingId={contextRating.id}/>]}
                      content={
                        <EntityRatingContent
                          title={contextRating.title}
                          value={contextRating.value}
                          text={rootComment.text}
                          source={contextRating.source}
                        />
                      }
                    >

                      <EntityRatingComments comments={comments}/>
                    </Comment>
                  )
                })
              }

            </div>
          )
        })
      }

      <AddEntityRatingButton/>
    </div>
  )
}

EntityRatings.defaultProps = {
  ratingsIds: [],
}


export default EntityRatings

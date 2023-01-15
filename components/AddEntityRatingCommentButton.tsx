import { FC } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { NextRouter, useRouter } from 'next/router'
import { Button, Typography } from 'antd'
import { RatingID } from '../dtos/Rating'
import produce from 'immer'
import { convertQueryParamToArray } from '../utils/utils'
import { EntrySlugEntity, mapSingularEntityNameToBrief, RatingSlugEntity, SlugVerb } from '../utils/types'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'


const { Text } = Typography


const redirectToRatingCommentForm = (router: NextRouter, ratingId: RatingID) => () => {
  const { query } = router
  const newQueryParams = produce(query, (draftState) => {
    const { slug } = draftState
    const slugArray = convertQueryParamToArray(slug)

    slugArray.push(
      mapSingularEntityNameToBrief[EntrySlugEntity.RATING],
      ratingId,
      mapSingularEntityNameToBrief[RatingSlugEntity.COMMENT],
      SlugVerb.CREATE,
    )
    draftState.slug = slugArray
  })

  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  router.replace(
    {
      pathname: `/m/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )
}


interface AddEntityRatingCommentButtonProps {
  ratingId: RatingID
}

const AddEntityRatingCommentButton: FC<AddEntityRatingCommentButtonProps> = (props) => {

  const { ratingId } = props

  const router = useRouter()
  const { t } = useTranslation('map')

  return (
    <Button
      type="text"
      size="small"
      onClick={redirectToRatingCommentForm(router, ratingId)}
    >
      <Text type="secondary">{t('ratings.newComment')}</Text>
    </Button>
  )
}


export default AddEntityRatingCommentButton
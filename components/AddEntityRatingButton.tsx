import { FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import produce from 'immer'
import { convertQueryParamToArray } from '../utils/utils'
import { EntrySlugEntity, mapSingularEntityNameToBrief, SlugVerb } from '../utils/types'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'
import { Button } from 'antd'


const redirectToNewRatingForm = (router: NextRouter) => () => {
  const { query } = router
  const newQueryParams = produce(query, (draftState) => {
    const { slug } = draftState
    const slugArray = convertQueryParamToArray(slug)

    slugArray.push(mapSingularEntityNameToBrief[EntrySlugEntity.RATING], SlugVerb.CREATE)
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


const AddEntityRatingButton: FC = () => {

  const router = useRouter()
  const { t } = useTranslation('map')

  return (
    <Button
      type="primary"
      onClick={redirectToNewRatingForm(router)}
      style={{
        width: '100%',
        marginBottom: 16,
      }}
    >
      {t('ratings.newRating')}
    </Button>
  )
}

export default AddEntityRatingButton
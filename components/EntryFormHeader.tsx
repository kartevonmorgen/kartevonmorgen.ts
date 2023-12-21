import { FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { produce } from 'immer'
import { PageHeader } from '@ant-design/pro-layout';
import { Translate } from 'next-translate'
import useTranslation from 'next-translate/useTranslation'
import { formActions, viewActions } from '../slices'
import { convertQueryParamToArray } from '../utils/utils'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'
import { AppDispatch } from '../store'


const calculateLevelsToBack = (isEdit: boolean): number => {
  if (!isEdit) {
    return 2
  }

  return 1
}

const onBack = (router: NextRouter, dispatch: AppDispatch, isEdit: boolean) => () => {
  const { query } = router

  const paramsToRemove = ['pinCenter']

  const newQueryParams = produce(query, (draftState) => {
    const { slug } = draftState
    const slugArray = convertQueryParamToArray(slug)

    const backLevel = calculateLevelsToBack(isEdit)

    slugArray.splice(slugArray.length - backLevel, backLevel)
    draftState.slug = slugArray

    paramsToRemove.forEach((p) => {
      delete draftState[p]
    })
  })

  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  dispatch(viewActions.setErrorMessage(null))
  dispatch(formActions.expireFormCache())
  router.replace(
    {
      pathname: `/m/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )
}


interface EntityFormHeaderProps {
  isEdit: boolean
}


const getHeaderTranslation = (t: Translate, isEdit: boolean): string => {
  if (isEdit) {
    return t('entryForm.editEntryHeading')
  }

  return t('entryForm.newEntryHeading')
}

const EntityFormHeader: FC<EntityFormHeaderProps> = (props) => {
  const { isEdit } = props

  const router = useRouter()
  const { t } = useTranslation('map')

  const dispatch = useDispatch()

  return (
    <PageHeader
      style={{
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 0,
        paddingBottom: 4,
      }}
      title={getHeaderTranslation(t, isEdit)}
      ghost={false}
      onBack={onBack(router, dispatch, isEdit)}
    />
  )
}

EntityFormHeader.defaultProps = {
  isEdit: false,
}


export default EntityFormHeader

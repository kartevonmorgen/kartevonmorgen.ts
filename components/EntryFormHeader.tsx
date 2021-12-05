import { FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import produce from 'immer'
import { PageHeader } from 'antd'
import { convertQueryParamToArray } from '../utils/utils'
import { Translate } from 'next-translate'
import useTranslation from 'next-translate/useTranslation'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'


const calculateLevelsToBack = (isEdit: boolean): number => {
  if (!isEdit) {
    return 2
  }

  return 1
}

const onBack = (router: NextRouter, isEdit: boolean) => () => {
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
      onBack={onBack(router, isEdit)}
    />
  )
}

EntityFormHeader.defaultProps = {
  isEdit: false,
}


export default EntityFormHeader

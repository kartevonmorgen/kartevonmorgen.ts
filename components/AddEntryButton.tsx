import React, { FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { Button, Tooltip } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import produce from 'immer'
import { convertQueryParamToArray } from '../utils/utils'
import { createSlugPathFromQueryAndRemoveSlug, getRootSlugActionFromQuery } from '../utils/slug'
import { PluralRootSlugEntity, RootSlugEntity, SlugVerb } from '../utils/types'
import useTranslation from 'next-translate/useTranslation'


const onAddEntity = (router: NextRouter) => () => {
  const { query } = router


  // be sure the state is not in the edit or create mode
  const slugAction = getRootSlugActionFromQuery(query)
  if (slugAction.entity !== RootSlugEntity.RESULT || slugAction.subSlugAction !== null) {
    return
  }

  const newQueryParams = produce(query, draftState => {
    const { slug } = query
    const slugArray = convertQueryParamToArray(slug)
    slugArray.push(PluralRootSlugEntity.ENTRIES, SlugVerb.CREATE)

    draftState.slug = slugArray
  })

  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  router.replace(
    {
      pathname: `/maps/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )
}

const AddEntryButton: FC = () => {
  const router = useRouter()
  const { t } = useTranslation('map')
  return (
    <Tooltip placement="left" title={t("tooltip.addEntry")}>
      <Button
        style={{
          marginBottom: 8,
        }}
        type="primary"
        size="middle"
        icon={<PlusCircleOutlined />}
        onClick={onAddEntity(router)}
      />
    </Tooltip>
  )
}

export default AddEntryButton

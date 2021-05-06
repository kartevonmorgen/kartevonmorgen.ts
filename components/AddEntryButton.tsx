import { FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import produce from 'immer'
import { convertQueryParamToArray } from '../utils/utils'
import { getSlugActionFromQuery } from '../utils/slug'
import { PluralSlugEntity, SlugEntity, SlugVerb } from '../utils/types'


const onAddEntity = (router: NextRouter) => () => {
  const { query } = router

  // be sure the state is not in the edit or create mode
  const slugAction = getSlugActionFromQuery(query)
  if (slugAction.entity !== SlugEntity.RESULT) {
    return
  }

  const newQueryParams = produce(query, draftState => {
    const { slug } = query
    const slugArray = convertQueryParamToArray(slug)
    slugArray.push(PluralSlugEntity.ENTRIES, SlugVerb.CREATE)

    draftState.slug = slugArray
  })

  router.replace(
    {
      pathname: '/maps/[...slug]',
      query: newQueryParams,
    },
    undefined,
    { shallow: true },
  )
}

const AddEntryButton: FC = () => {
  const router = useRouter()

  return (
    <Button
      type="primary"
      size="large"
      shape="circle"
      icon={<PlusCircleOutlined/>}
      onClick={onAddEntity(router)}
    />
  )
}

export default AddEntryButton
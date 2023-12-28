import { FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { produce } from 'immer'
import { PageHeader } from '@ant-design/pro-layout'
import { Button } from 'antd'
import ArrowLeftOutlined from '@ant-design/icons/lib/icons/ArrowLeftOutlined'
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined'
import { convertQueryParamToArray } from '../utils/utils'
import { SlugVerb } from '../utils/types'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'
import { deleteSlugLevelsFromRouter } from '../utils/router'


const onBack = (router: NextRouter) => () => {
  const newQueryParams = deleteSlugLevelsFromRouter(2, router)
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

const onEdit = (router: NextRouter) => () => {
  const { query } = router
  const newQueryParams = produce(query, (draftState) => {
    const { slug } = draftState
    const slugArray = convertQueryParamToArray(slug)
    slugArray.push(SlugVerb.EDIT)

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


interface EntityDetailHeaderProps {
  hasImage: boolean
}

const EntityDetailHeader: FC<EntityDetailHeaderProps> = (props) => {
  const { hasImage } = props

  const router = useRouter()


  return (
    <PageHeader
      backIcon={
        <ArrowLeftOutlined
          style={{
            backgroundColor: 'white',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            boxShadow: '0 2px 0 rgba(0, 0, 0, 0.02)',
            color: 'rgba(0, 0, 0, 0.88)',
            cursor: 'pointer',
            padding: '2px'
          }}
        />
      }
      style={{
        paddingLeft: hasImage ? 16 : 0,
        paddingRight: hasImage ? 16 : 0,
        paddingTop: 0,
        paddingBottom: 4,
        position: hasImage ? 'absolute' : 'relative',
        right: 0,
        left: 0,
      }}
      ghost={false}
      onBack={onBack(router)}
      extra={[
        <Button
          key='edit-icon-button'
          type='default'
          size='small'
          icon={<EditOutlined />}
          onClick={onEdit(router)}
        />,
      ]}
    />
  )
}


export default EntityDetailHeader

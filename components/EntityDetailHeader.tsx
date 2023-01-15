import { NextRouter, useRouter } from 'next/router'
import produce from 'immer'
import { Button, PageHeader } from 'antd'
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


const EntityDetailHeader = () => {
  const router = useRouter()


  return (
    <PageHeader
      style={{
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 0,
        paddingBottom: 4,
      }}
      ghost={false}
      onBack={onBack(router)}
      extra={[
        <Button
          key="1"
          type="primary"
          size="small"
          icon={<EditOutlined/>}
          onClick={onEdit(router)}
        />,
      ]}
    />
  )
}


export default EntityDetailHeader

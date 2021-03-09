import { Button } from 'antd'
import { NextRouter, useRouter } from 'next/router'
import produce from 'immer'
import { PlusCircleOutlined } from '@ant-design/icons'
import { convertQueryParamToArray } from '../utils/utils'
import { PluralSlugEntity, SlugVerb } from '../utils/types'


const onAddEntity = (router: NextRouter) => () => {
  const { query } = router

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

const SidebarNav = () => {
  const router = useRouter()

  return (
    <div>
      <Button
        shape="round"
        icon={<PlusCircleOutlined/>}
        size="small"
        style={{
          width: '100%',
        }}
        type="primary"
        onClick={onAddEntity(router)}
      >
        Add An Entry
      </Button>
    </div>
  )
}

export default SidebarNav
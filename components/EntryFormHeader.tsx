import { NextRouter, useRouter } from 'next/router'
import produce from 'immer'
import { Button, PageHeader } from 'antd'
import { SaveOutlined } from '@ant-design/icons/lib'
import { convertQueryParamToArray } from '../utils/utils'


const onBack = (router: NextRouter) => () => {
  const { query } = router
  const newQueryParams = produce(query, draftState => {
    const { slug } = draftState
    const slugArray = convertQueryParamToArray(slug)

    slugArray.splice(slugArray.length - 2, 2)
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


const EntityFormHeader = () => {
  const router = useRouter()


  return (
    <PageHeader
      title="Create an Entry"
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
          icon={<SaveOutlined/>}
        />,
      ]}
    />
  )
}


export default EntityFormHeader
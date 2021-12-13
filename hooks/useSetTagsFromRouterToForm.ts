import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { FormInstance } from 'antd'
import { convertQueryParamToArray } from '../utils/utils'


const useSetTagsFromRouterToForm = (form: FormInstance) => {
  const router = useRouter()
  const { query } = router
  const { tag: tagParam } = query
  const tags = convertQueryParamToArray(tagParam)

  useEffect(() => {
    form.setFieldsValue({ tags })
  }, [])
}


export default useSetTagsFromRouterToForm
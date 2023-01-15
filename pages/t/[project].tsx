import { useRouter } from 'next/router'
import { Alert } from 'antd'
import useRequest from '../../api/useRequest'
import API_ENDPOINTS from '../../api/endpoints'
import Table from './components/Table'
import { SearchEventsRequest as SearchEventsRequestDTO } from '../../dtos/SearchEventsRequest'
import { Events } from '../../dtos/Event'
import { GetServerSideProps } from 'next'
import { convertQueryToEventRequestAndSetTimeBoundaries } from '../../adaptors'


const IFrameTable = () => {
  const router = useRouter()
  const { query } = router

  const searchEventsRequestDTO: SearchEventsRequestDTO = convertQueryToEventRequestAndSetTimeBoundaries(query)

  const { data, error } = useRequest<Events>({
    url: API_ENDPOINTS.searchEvents(),
    params: searchEventsRequestDTO,
  })

  if (error) {
    return (
      <Alert
        message="Error"
        description="Sorry, there seems to be a problem"
        type="error"
        showIcon
      />
    )
  }

  return (
    <Table dataSource={data}/>
  )
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const project = ctx.params

  return {
    props: {
      project,
    },
  }
}

export default IFrameTable

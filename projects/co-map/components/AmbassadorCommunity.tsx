import { FC, useState } from 'react'
import { AxiosInstance } from '../../../api'
import { BASICS_ENDPOINTS as CO_MAP_BASICS_ENDPOINTS } from '../api/endpoints/BasicEndpoints'


const AmbassadorCommunity: FC = () => {

  const [communityParams, setCommunityParams] = useState({
    'cities_count': '',
    'ambassadors_count': '',
  })

  if (
      communityParams.cities_count === '' ||
      communityParams.ambassadors_count === ''
  ) {
      AxiosInstance.GetRequest<{
          cities_count: string;
          ambassadors_count: string;
      }>(CO_MAP_BASICS_ENDPOINTS.getAmbassadorCommunityParams()).then(
          (response) => {
              setCommunityParams(response.data);
          },
      );
  }

  let circleSize = 40 + 10 * Math.max(communityParams.ambassadors_count.length, communityParams.cities_count.length)

  return (
    <div className={'ambassador_community'}>
      <h1 className={'co_map_title'}>
        Сообщество амбассадоров
      </h1>

      <div className={'ambassadors_parent'}>
        <div className={'info_community'}>
          <div className={'info_ambassadors'}>
            <div className={'circle_around_text'}
                 style={{ width: circleSize, height: circleSize, borderRadius: circleSize / 2 }}>
              <h3 className={'co_map_text center'}>
                {communityParams.cities_count}
              </h3>
            </div>
            <h3 className={'co_map_text'}>
              Городов
            </h3>
          </div>
          <div className={'info_ambassadors'}>
            <div className={'circle_around_text'}
                 style={{ width: circleSize, height: circleSize, borderRadius: circleSize / 2 }}>
              <h3 className={'co_map_text center'}>
                {communityParams.ambassadors_count}
              </h3>
            </div>
            <h3 className={'co_map_text'}>
              Амбассадоров
            </h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AmbassadorCommunity
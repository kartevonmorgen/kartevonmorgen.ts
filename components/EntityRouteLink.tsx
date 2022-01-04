import { FC } from 'react'
import { Typography } from 'antd'
import useTranslation from 'next-translate/useTranslation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LatLng } from '../utils/geolocation'
import { ROUTE_FINDER, RouteFinder } from '../consts/route_finder'
import useMobileDetect, { GetMobileDetect } from '../hooks/useMobileDetect'
import { EntityAddress as EntityAddressDTO } from '../dtos/EntityAddress'


interface EntityRouteLinkProps {
  latLng: LatLng
  address: EntityAddressDTO
}


const { Link } = Typography


const convertAddressToString = (address: EntityAddressDTO): string => (
  `${address.street}+${address.zip}+${address.city}`
)

const getRouteFinder = (getMobileDetect: GetMobileDetect, latLng: LatLng, address: EntityAddressDTO): RouteFinder => {
  let routeFinder: RouteFinder = { ...ROUTE_FINDER.default }
  if (getMobileDetect.isAndroid()) {
    routeFinder = { ...ROUTE_FINDER.android }
  } else if (getMobileDetect.isIos()) {
    routeFinder = { ...ROUTE_FINDER.apple }
  }

  routeFinder.link = routeFinder.link.replace('{lat}', latLng.lat.toFixed(4))
  routeFinder.link = routeFinder.link.replace('{lng}', latLng.lng.toFixed(4))
  routeFinder.link = routeFinder.link.replace('{addr}', convertAddressToString(address))

  return routeFinder
}


const EntityRouteLink: FC<EntityRouteLinkProps> = (props) => {
  const { latLng, address } = props

  const { t } = useTranslation('map')

  const mobileDetect = useMobileDetect()

  const routeFinder = getRouteFinder(mobileDetect, latLng, address)


  return (
    <div>
      <div
        style={{
          display: 'inline-block',
          marginRight: 4,
        }}
      >
        <FontAwesomeIcon icon="route"/>
      </div>

      <Link
        target="_blank"
        href={routeFinder.link}
        title={`Hinfinden mit ${routeFinder.name}`}
      >
        {t('entryDetails.route')}
      </Link>
    </div>
  )
}


export default EntityRouteLink
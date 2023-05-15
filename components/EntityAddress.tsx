import { FC } from 'react'
import addressFormatter from '@fragaria/address-formatter'
import pickBy from 'lodash/pickBy'
import isString from 'lodash/isString'
import { EntityAddress as EntryAddressDTO } from '../dtos/EntityAddress'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


interface EntryAddressProps extends EntryAddressDTO {
}

const EntityAddress: FC<EntryAddressProps> = (props) => {
  const addressFields = pickBy(props, isString)

  return (
    <div
      key={`contact-address`}
    >
      <div
        style={{
          display: 'inline-block',
          marginRight: 4,
        }}
      >
        <FontAwesomeIcon icon="map-marker-alt"/>
      </div>

      {addressFormatter.format(addressFields, {countryCode: 'DE'})}
    </div>
  )
}


export default EntityAddress

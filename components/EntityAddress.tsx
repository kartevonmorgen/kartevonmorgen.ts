import React, { FC } from 'react'
import { Col, Row } from 'antd'
import addressFormatter from '@fragaria/address-formatter'
import { EntityAddress as EntryAddressDTO } from '../dtos/EntityAddress'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


interface EntryAddressProps extends EntryAddressDTO {
}

const EntityAddress: FC<EntryAddressProps> = (props) => {
  return (
    <Row
      key={`contact-address`}
    >
      <Col xs={1}>
        <FontAwesomeIcon icon="map-marker-alt"/>
      </Col>

      <Col>
        {addressFormatter.format(props)}
      </Col>
    </Row>
  )
}


export default EntityAddress

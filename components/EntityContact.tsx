import React, { FC } from 'react'
import { Col, Row, Typography } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { EntryContact as EntryContactDTO, EntryContactKeys } from '../dtos/EntryContact'

const { Link } = Typography

const propToIcon: Record<EntryContactKeys, string> = {
  [EntryContactKeys.CONTACT_NAME]: 'user',
  [EntryContactKeys.TELEPHONE]: 'phone',
  [EntryContactKeys.EMAIL]: 'envelope',
  [EntryContactKeys.HOMEPAGE]: 'globe',
}

interface EntryContactProps extends EntryContactDTO {

}

const EntityContact: FC<EntryContactProps> = (props) => {

  const {
    contact_name,
    email,
    homepage,
    telephone,
  } = props

  return (
    <address>
      {contact_name && (
        <Row
          key={`contact-${EntryContactKeys.CONTACT_NAME}`}
        >
          <Col xs={1}>
            <FontAwesomeIcon icon={propToIcon[EntryContactKeys.CONTACT_NAME] as IconProp}/>
          </Col>

          <Col>
            {contact_name}
          </Col>
        </Row>
      )
      }

      {telephone && (
        <Row
          key={`contact-${EntryContactKeys.TELEPHONE}`}
        >
          <Col xs={1}>
            <FontAwesomeIcon icon={propToIcon[EntryContactKeys.TELEPHONE] as IconProp}/>
          </Col>

          <Col>
            {telephone}
          </Col>
        </Row>
      )
      }

      {email && (
        <Row
          key={`contact-${EntryContactKeys.EMAIL}`}
        >
          <Col xs={1}>
            <FontAwesomeIcon icon={propToIcon[EntryContactKeys.EMAIL] as IconProp}/>
          </Col>

          <Col>
            <Link target="_blank" href={`mailto:${email}`}>{email}</Link>
          </Col>
        </Row>
      )
      }

      {homepage && (
        <Row
          key={`contact-${EntryContactKeys.HOMEPAGE}`}
        >
          <Col xs={1}>
            <FontAwesomeIcon icon={propToIcon[EntryContactKeys.HOMEPAGE] as IconProp}/>
          </Col>

          <Col>
            <Link target="_blank" href={homepage} rel="noopener noreferrer">{homepage}</Link>
          </Col>
        </Row>
      )
      }
    </address>
  )
}


export default EntityContact

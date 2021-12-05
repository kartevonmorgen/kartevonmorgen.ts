import React, { FC, Fragment } from 'react'
import { Col, Row } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { EntryContact as EntryContactDTO } from '../dtos/EntryContact'


interface EntryContactProps extends EntryContactDTO {
}


// NOTE: order maters
const propToIcon = [
  ['contact_name', 'user'],
  ['telephone', 'phone'],
  ['email', 'envelope'],
  ['homepage', 'globe'],
]

const EntityContact: FC<EntryContactProps> = (props) => {
  return (
    <Fragment>
      {/* general contact*/}
      {
        propToIcon.map(([attribute, iconName]) => {
          if (!props[attribute]) {
            return null
          }

          return (
            <Row
              key={`contact-${attribute}`}
            >
              <Col xs={1}>
                <FontAwesomeIcon icon={iconName as IconProp}/>
              </Col>

              <Col>
                {props[attribute]}
              </Col>
            </Row>
          )
        })
      }
    </Fragment>
  )
}


export default EntityContact

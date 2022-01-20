import { FC } from 'react'
import { Typography } from 'antd'
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
    <address
      style={{
        margin: 0,
      }}
    >
      {contact_name && (
        <div
          key={`contact-${EntryContactKeys.CONTACT_NAME}`}
        >
          <div
            style={{
              display: 'inline-block',
              marginRight: 4,
            }}
          >
            <FontAwesomeIcon icon={propToIcon[EntryContactKeys.CONTACT_NAME] as IconProp}/>
          </div>

          {contact_name}
        </div>
      )}

      {telephone && (
        <div
          key={`contact-${EntryContactKeys.TELEPHONE}`}
        >
          <div
            style={{
              display: 'inline-block',
              marginRight: 4,
            }}
          >
            <FontAwesomeIcon icon={propToIcon[EntryContactKeys.TELEPHONE] as IconProp}/>
          </div>

          {telephone}
        </div>
      )
      }

      {email && (
        <div
          key={`contact-${EntryContactKeys.EMAIL}`}
        >
          <div
            style={{
              display: 'inline-block',
              marginRight: 4,
            }}
          >
            <FontAwesomeIcon icon={propToIcon[EntryContactKeys.EMAIL] as IconProp}/>
          </div>

          <Link target="_blank" href={`mailto:${email}`}>{email}</Link>
        </div>
      )
      }

      {homepage && (
        <div
          key={`contact-${EntryContactKeys.HOMEPAGE}`}
        >
          <div
            style={{
              display: 'inline-block',
              marginRight: 4,
            }}
          >
            <FontAwesomeIcon icon={propToIcon[EntryContactKeys.HOMEPAGE] as IconProp}/>
          </div>

          <Link target="_blank" href={homepage} rel="noopener noreferrer">{homepage}</Link>
        </div>
      )
      }
    </address>
  )
}


export default EntityContact

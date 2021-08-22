import React, { FC } from 'react'
import { Button, message, Typography } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CopyToClipboard } from 'react-copy-to-clipboard'


const { Link } = Typography

interface MapSharingModalFooterProps {
  onOk: () => void
  onCancel: () => void
  iframeCode: string
}

const MapSharingModalFooter: FC<MapSharingModalFooterProps> = (props) => {

  const { onOk, onCancel, iframeCode } = props

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Button
        onClick={onCancel}
        type="primary"
        icon={
          <FontAwesomeIcon
            icon={['far', 'times-circle']}
            style={{
              marginRight: 8,
            }}
          />
        }

      >
        Close
      </Button>

      <Link
        href="http://blog.vonmorgen.org/iframes/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Find Out More
      </Link>

      <CopyToClipboard
        onCopy={
          () => {
            onOk()
            message.success('Iframe code copied to clipboard', 3)
          }
        }
        text={iframeCode}
      >
        <Button
          onClick={onOk}
          type="primary"
          icon={
            <FontAwesomeIcon
              icon={['far', 'copy']}
              style={{
                marginRight: 8,
              }}
            />
          }
        >
          Copy
        </Button>
      </CopyToClipboard>
    </div>
  )
}


export default MapSharingModalFooter
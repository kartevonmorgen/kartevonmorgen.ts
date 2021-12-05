import React, { FC } from 'react'
import useTranslation from 'next-translate/useTranslation'
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

  const { t } = useTranslation('map')

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
        {t('modal.events.close')}
      </Button>

      <Link
        href="http://blog.vonmorgen.org/iframes/"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('modal.embed.findOutMore')}
      </Link>

      <CopyToClipboard
        onCopy={
          () => {
            onOk()
            message.success(t('growler.iframeCopied'), 3)
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
          {t('copy')}
        </Button>
      </CopyToClipboard>
    </div>
  )
}


export default MapSharingModalFooter

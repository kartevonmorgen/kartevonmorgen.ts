import React, { FC, useEffect, useState } from 'react'
import { Button, notification, Tooltip } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import useTranslation from 'next-translate/useTranslation'


interface ShareEntryButtonProps {
  showButton: boolean,
  openHandler: (value: boolean) => void
  embedHandler: () => void
  subscribeHandler: () => void
}

interface ButtonSizeType {
  main: string
  sub: string
}

const ShareEntryButton: FC<ShareEntryButtonProps> = (props) => {

  const { t } = useTranslation('map')

  const arrayOfTitle = [t('embed'), t('copy'), t('share'), t('subscribe')]

  const [url, setUrl] = useState<string>('')

  const [buttonSize, setButtonSize] = useState<ButtonSizeType>({ main: '140px', sub: '100px' })

  const calculateWidthOfMaxStringLength = (arrayOfString: Array<string>) => {
    const longestWord = arrayOfString.reduce((a, b) => a.length > b.length ? a : b, '')
    if (longestWord.length > 6) {
      setButtonSize({ main: '140px', sub: '100px' })
    }
    if (longestWord.length > 9) {
      setButtonSize({ main: '160px', sub: '120px' })
    }
    if (longestWord.length > 12) {
      setButtonSize({ main: '180px', sub: '140px' })
    }
    if (longestWord.length > 15) {
      setButtonSize({ main: '200px', sub: '160px' })
    }
  }
  const mainButtonHandler = () => {
    props.openHandler(!props.showButton)
  }

  const showNotification = () => {
    notification.open({
      message: `${t('growler.linkCopied')}`,
    })
  }

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  useEffect(() => {
    calculateWidthOfMaxStringLength(arrayOfTitle)
  }, [t])

  return (
    <div id={'share-entry-button'}>
      <div className={'dropdown-container'}>
          <Button className={'dropdown-button'}
                  style={{
                    width: `${props.showButton ? buttonSize.sub : '0px'}`,
                    height: `${props.showButton ? '40px' : '0px'}`,
                  }}
                  onClick={props.subscribeHandler}
                  >
            <div className={'text-container'}>
              <span className={'small-text'}>{t('subscribe')}</span>
              <FontAwesomeIcon icon="envelope" color="black" />
            </div>
          </Button>
        <CopyToClipboard text={url}>
          <Button className={'dropdown-button'}
                  style={{
                    width: `${props.showButton ? buttonSize.sub : '0px'}`,
                    height: `${props.showButton ? '40px' : '0px'}`,
                    marginBottom: `${props.showButton ? '10px' : '0px'}`,
                    marginTop: `${props.showButton ? '10px' : '0px'}`,
                  }}
                  onClick={() => {
                    showNotification()
                  }}>
            <div className={'text-container'}>
              <span>{t('copy')}</span>
              <FontAwesomeIcon icon="link" color="black" />
            </div>
          </Button>
        </CopyToClipboard>
        <Button className={'dropdown-button'}
                style={{
                  width: `${props.showButton ? buttonSize.sub : '0px'}`,
                  height: `${props.showButton ? '40px' : '0px'}`,
                  marginBottom: `${props.showButton ? '10px' : '0px'}`,
                }}
                onClick={props.embedHandler}>
          <div className={'text-container'}>
            <span>{t('embed')}</span>
            <FontAwesomeIcon icon="code" color="black" />
          </div>
        </Button>
      </div>
      <Button className={'main-button'} style={{ width: buttonSize.main }}
              onClick={() => mainButtonHandler()}>
        <FontAwesomeIcon icon="share" color="black" />
        <span style={{ marginLeft: '5px' }}>{t('share')}</span>
      </Button>
    </div>

  )
}

export default ShareEntryButton

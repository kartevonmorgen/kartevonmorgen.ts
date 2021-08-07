import React, { useEffect, useState } from 'react'
import { Button,notification  } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CopyToClipboard } from 'react-copy-to-clipboard'

interface ShareEntryButtonType {
  showButton: boolean,
  openHandler: (value: boolean) => void
  embedHandler: () => void
  subscribeHandler: () => void
}

const ShareEntryButton: (props: ShareEntryButtonType) => JSX.Element = (props: ShareEntryButtonType) => {
  const [url, setUrl] = useState<string>('')

  const showButtons = props.showButton
  const setShowButtons = props.openHandler

  const mainButtonHandler = () => {
    const a = document.getElementsByClassName('leaflet-verticalcenter')
    // @ts-ignore
    showButtons ? a[1].style.bottom = '20px' : a[1].style.bottom = '160px'
    setShowButtons(!showButtons)
  }

  const showNotification = () => {
    notification.open({
      message: 'Link copied to clipboard successfully!',
    });
  }

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  return (
    <div id={'share-entry-button'}>
      <div className={'dropdown-container'}>
        <Button className={'dropdown-button'}
                style={{
                  width: `${showButtons ? '100px' : '0px'}`,
                  height: `${showButtons ? '35px' : '0px'}`,
                }}
                onClick={props.subscribeHandler}>
          <FontAwesomeIcon icon="envelope" color="black" />
          <span className={'text'}>Subscribe</span>
        </Button>
        <CopyToClipboard text={url}>
          <Button className={'dropdown-button'}
                  style={{
                    width: `${showButtons ? '100px' : '0px'}`,
                    height: `${showButtons ? '35px' : '0px'}`,
                    marginBottom: `${showButtons ? '10px' : '0px'}`,
                    marginTop: `${showButtons ? '10px' : '0px'}`,
                  }}
                  onClick={() => {showNotification()}}>
            <FontAwesomeIcon icon="link" color="black" />
            <span className={'text'}>Copy</span>
          </Button>
        </CopyToClipboard>
        <Button className={'dropdown-button'}
                style={{
                  width: `${showButtons ? '100px' : '0px'}`,
                  height: `${showButtons ? '35px' : '0px'}`,
                  marginBottom: `${showButtons ? '10px' : '0px'}`,
                }}
                onClick={props.embedHandler}>
          <FontAwesomeIcon icon="code" color="black" />
          <span className={'text'}>Embed</span>
        </Button>
      </div>
      <Button className={'main-button'}
              onClick={() => mainButtonHandler()}>
        <FontAwesomeIcon icon="share" color="black" />
        <span style={{ marginLeft: '5px' }}>Share</span>
      </Button>
    </div>

  )
}

export default ShareEntryButton

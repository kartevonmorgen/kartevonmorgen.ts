import { FC, Fragment } from 'react'
import { Button, Modal } from 'antd'
import { useBoolean } from 'ahooks'
import Lowlight from 'react-lowlight'
import xmlSyntax from 'highlight.js/lib/languages/xml'
import MapSharingModalFooter from './MapSharingModalFooter'
import 'highlight.js/styles/github.css'


Lowlight.registerLanguage('xml', xmlSyntax)


const generateIframeCode = (url: string): string => (
  `<div style="text-align: center;">
    <iframe style="display: inline-block; border: none" src="${url}" width="100%" height="580">
      <a href="${url}" target="_blank">zur karte</a>
    </iframe>
  </div>
  <p style="text-align: right;">
    <a href="${url}" target="_blank" rel="noreferrer noopener" aria-label=" (öffnet in neuem Tab)">Große Karte öffnen</a>
  </p>`
)


const MapSharingModal: FC = () => {
  const [isModalVisible, { setTrue: showModal, setFalse: hideModal }] = useBoolean()

  const iframeCode = generateIframeCode(window.location.href)

  return (
    <Fragment>
      <Button
        type="link"
        style={{
          color: 'black',
        }}
        onClick={showModal}
      >
        Embed
      </Button>

      <Modal
        visible={isModalVisible}
        closable={false}
        footer={
          <MapSharingModalFooter
            onOk={hideModal}
            onCancel={hideModal}
            iframeCode={iframeCode}
          />
        }
      >

        <Lowlight
          language="html"
          value={iframeCode}
        />

      </Modal>

    </Fragment>
  )
}

export default MapSharingModal
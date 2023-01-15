import { FC } from 'react'
import Lowlight from 'react-lowlight'
import xmlSyntax from 'highlight.js/lib/languages/xml'
import 'highlight.js/styles/github.css'
import MapSharingModalFooter from './MapSharingModalFooter'


Lowlight.registerLanguage('xml', xmlSyntax)


const generateIframeCode = (url: string): string => (
  `<div style="text-align: center;">
    <iframe id="kvm" name="kvm"  style="display: inline-block; border: none" src="${url}" width="100%" height="580">
      <a href="${url}" target="_blank">zur karte</a>
    </iframe>
  </div>
  <p style="text-align: right;">
    <a href="${url}" target="_blank" rel="noreferrer noopener" aria-label=" (öffnet in neuem Tab)">Große Karte öffnen</a>
  </p>`
)


interface MapViewTabContentProps {
  onOk: () => void
  onCancel: () => void
}

const MapViewTabContent: FC<MapViewTabContentProps> = (props) => {
  const { onOk, onCancel } = props

  const iframeCode = generateIframeCode(window.location.href)

  return (
    <div>
      <Lowlight
        language="html"
        value={iframeCode}
      />

      <MapSharingModalFooter
        onOk={onOk}
        onCancel={onCancel}
        iframeCode={iframeCode}
      />
    </div>
  )
}


export default MapViewTabContent

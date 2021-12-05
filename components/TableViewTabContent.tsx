import { FC } from 'react'
import { useRouter } from 'next/router'
import { useMap } from 'react-leaflet'
import Lowlight from 'react-lowlight'
import xmlSyntax from 'highlight.js/lib/languages/xml'
import 'highlight.js/styles/github.css'
import { convertMapURLTOTableViewURL } from '../utils/slug'
import MapSharingModalFooter from './MapSharingModalFooter'


Lowlight.registerLanguage('xml', xmlSyntax)


const generateIframeCode = (url: string): string => (
  `<div style="text-align: center;">
    <iframe id="kvm" name="kvm" style="display: inline-block; border: none" src="${url}" width="100%" height="620">
      <a href="${url}" target="_blank">zur karte</a>
    </iframe>
  </div>
  <p style="text-align: right;">
    <a href="${url}" target="_blank" rel="noreferrer noopener" aria-label=" (öffnet in neuem Tab)">Große Karte öffnen</a>
  </p>`
)


interface TableViewTabContentProps {
  onOk: () => void
  onCancel: () => void
}

const TableViewTabContent: FC<TableViewTabContentProps> = (props) => {
  const { onOk, onCancel } = props

  const router = useRouter()
  const { query } = router
  const map = useMap()
  const bbox = map.getBounds()

  const tableViewURL: string = convertMapURLTOTableViewURL(
    window.location.href,
    query,
    bbox,
  )
  const iframeCode = generateIframeCode(tableViewURL)

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


export default TableViewTabContent

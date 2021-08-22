import { FC } from 'react'
import { Button, Dropdown, Menu } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CopyURLToClipboardButton from './CopyURLToClipboardButton'
import MapSharingModal from './MapSharingModal'


const { Item } = Menu


const menu = (
  <Menu
    style={{
      right: 40,
    }}
  >
    <Item
      icon={
        <FontAwesomeIcon
          icon={['far', 'copy']}
        />
      }>
      <CopyURLToClipboardButton/>
    </Item>

    <Item
      icon={
        <FontAwesomeIcon
          icon="code"
        />
      }
    >
      <MapSharingModal/>
    </Item>
  </Menu>
)

const MapSharingDropdown: FC = () => {
  return (
    <Dropdown
      overlay={menu}
      placement="topLeft"
    >
      <Button
        type="primary"
        size="middle"
        icon={
          <FontAwesomeIcon
            icon="share"
            style={{
              marginRight: 4,
            }}
          />}
      >
        Share
      </Button>
    </Dropdown>
  )
}


export default MapSharingDropdown
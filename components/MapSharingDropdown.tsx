import { FC } from 'react'
import { Button, Dropdown, Menu } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CopyURLToClipboardButton from './CopyURLToClipboardButton'


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
          style={{
            marginRight: 8,
          }}
        />
      }>
      <CopyURLToClipboardButton/>
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
import {Button} from 'antd'
import {green} from '@ant-design/colors'
import {MenuFoldOutlined, PlusCircleOutlined} from '@ant-design/icons'


const NavSidebar = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}
  >
    <Button
      shape="round"
      icon={<MenuFoldOutlined/>}
      size="small"
    />
    <Button
      shape="round"
      icon={<PlusCircleOutlined/>}
      size="small"
      style={{
        color: green[5],
        borderColor: green[5]
      }}
    />
  </div>
)

export default NavSidebar
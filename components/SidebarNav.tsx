import { Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'


const SidebarNav = () => (
  <div>
    <Button
      shape="round"
      icon={<PlusCircleOutlined/>}
      size="small"
      style={{
        width: '100%',
      }}
      type="primary"
    >
      Add An Entry
    </Button>
  </div>
)

export default SidebarNav
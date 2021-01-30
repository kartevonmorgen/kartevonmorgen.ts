import {Button, Collapse, Space} from 'antd'
import {FilterOutlined} from '@ant-design/icons'

const {Panel} = Collapse

import TypeChooser from './TypeChooser'


const Filters = () => (
  <Collapse
    className="no-pad-collapse"
    defaultActiveKey={['1']}
    expandIcon={(_) => null}
    expandIconPosition="right"
    ghost
  >
    <Panel
      header={
        <Button
          type="primary"
          icon={
            <FilterOutlined/>
          }
          size="small"
          style={{
            width: '100%',
            marginBottom: 8
          }}
        >
          Filters
        </Button>
      }
      key="1"
    >
      <Space
        size="small"
        direction="vertical"
        style={{width: '100%'}}
      >
        <TypeChooser/>
      </Space>
    </Panel>
  </Collapse>
)


export default Filters
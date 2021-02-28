import { FC } from 'react'
import { Button, Collapse, Space } from 'antd'
import { FilterOutlined } from '@ant-design/icons'
import TypeChooser from './TypeChooser'
import SearchTags from './SearchTags'
import { TagsCount } from '../dtos/TagCount'

const { Panel } = Collapse


export interface FiltersProps {
  tagsCount: TagsCount
}

const Filters: FC<FiltersProps> = (props) => (
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
            marginBottom: 8,
          }}
        >
          Filters
        </Button>
      }
      key="1"
    >
      <Space
        size="small"
        style={{ width: '100%' }}
        wrap
      >
        <TypeChooser/>
      </Space>

      <SearchTags
        optionsCount={props.tagsCount}
      />
    </Panel>
  </Collapse>
)


export default Filters
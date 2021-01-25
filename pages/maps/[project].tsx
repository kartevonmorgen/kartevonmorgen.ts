import {useMemo} from 'react'
import dynamic from 'next/dynamic'
import {useToggle} from 'ahooks'

import {Layout, Space, Button, Input, Collapse} from 'antd'

const {Content, Sider} = Layout
const {Search} = Input
const {Panel} = Collapse

import {MenuFoldOutlined, PlusCircleOutlined} from '@ant-design/icons'

import ResultList from '../../components/ResultList'


const MapPage = () => {
  const Map = useMemo(() => dynamic(
    () => import('../../components/map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  const [isSideBarCollapsed, {toggle: toggleIsSideBarCollapsed}] = useToggle()

  return (
    <Layout
      hasSider
    >
      <Sider
        theme="light"
        collapsible
        collapsed={isSideBarCollapsed}
        onCollapse={toggleIsSideBarCollapsed}
        width="68vh"
        trigger={null}
        style={{
          padding: 4
        }}
      >
        <Space
          size="small"
          direction="vertical"
          style={{width: '100%'}}
        >
          {/*todo: create a background of dark with bottom shadow*/}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Button shape="round" icon={<MenuFoldOutlined/>} size="middle"/>
            <Button shape="round" icon={<PlusCircleOutlined/>} size="middle"/>
          </div>

          <Search
            placeholder="input search text"
            allowClear
            enterButton
            size="large"
            onSearch={() => {
            }}
          />

          <Collapse
            className="no-pad-collapse"
            defaultActiveKey={['1']}
            expandIcon={(_) => null}
            expandIconPosition="right"
            ghost
          >
            <Panel
              header={<span style={{float: 'right'}}>Filters</span>}
              key="1"
            >
              <p>asdkfjhskjdhfkjshfdiuwer</p>
            </Panel>
          </Collapse>

          <div
            style={{
              height: 'calc(100vh - 85px)',
              marginRight: -4
            }}
          >
            <ResultList/>
          </div>
        </Space>
      </Sider>
      <Content>
        <Map/>
      </Content>
    </Layout>
  )
}


export default MapPage
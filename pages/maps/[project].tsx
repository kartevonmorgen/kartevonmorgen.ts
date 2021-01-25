import {useMemo} from 'react'
import dynamic from 'next/dynamic'
import {useToggle} from 'ahooks'

import {Layout, Space, Button, Input, Collapse} from 'antd'

const {Content, Sider} = Layout
const {Search} = Input
const {Panel} = Collapse

import {MenuFoldOutlined, PlusCircleOutlined, FilterOutlined} from '@ant-design/icons'

import ResultList from '../../components/ResultList'
import TypeChooser from '../../components/TypeChooser'
import SearchTags from '../../components/SearchTags'


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
            <Button shape="round" icon={<MenuFoldOutlined/>} size="small"/>
            <Button shape="round" icon={<PlusCircleOutlined/>} size="small"/>
          </div>

          {/*todo: make the search component a separate component to prevent unnecessary renders*/}
          <Search
            placeholder="input search text"
            allowClear
            enterButton
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
              header={
                <Button
                  type="primary"
                  icon={
                    <FilterOutlined/>
                  }
                  size="small"
                  style={{
                    width: "100%",
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
                <SearchTags/>
              </Space>
            </Panel>
          </Collapse>

          {/*todo: make the height dynamic*/}
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
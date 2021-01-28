import {useMemo} from 'react'
import dynamic from 'next/dynamic'
import {useToggle} from 'ahooks'

import {Layout, Space, Button, Input, Collapse} from 'antd'

const {Content, Sider} = Layout
const {Search} = Input
const {Panel} = Collapse

import {MenuFoldOutlined, PlusCircleOutlined, FilterOutlined} from '@ant-design/icons'
import {green} from '@ant-design/colors'

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
        width="64vw"
        trigger={null}
        style={{
          padding: 4,
          height: "100vh"
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

          <ResultList/>
        </Space>
      </Sider>
      <Content>
        <Map/>
      </Content>
    </Layout>
  )
}


export default MapPage
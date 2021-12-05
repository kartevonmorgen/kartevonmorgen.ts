import { FC } from 'react'
import { Tabs } from 'antd'
import MapViewTabContent from './MapViewTabContent'
import TableViewTabContent from './TableViewTabContent'

const { TabPane } = Tabs


interface SharingModalTabsProps {
  hideModal: () => void
}

const SharingModalTabs: FC<SharingModalTabsProps> = (props) => {
  const { hideModal } = props

  return (
    <Tabs defaultActiveKey="1">
      <TabPane
        tab="Map View"
        key="1"
      >
        <MapViewTabContent
          onOk={hideModal}
          onCancel={hideModal}
        />
      </TabPane>

      <TabPane
        tab="Table View"
        key="2"
      >
        <TableViewTabContent
          onOk={hideModal}
          onCancel={hideModal}
        />
      </TabPane>
    </Tabs>
  )
}


export default SharingModalTabs

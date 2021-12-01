import { FC, Fragment } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { Button, Modal } from 'antd'
import { useBoolean } from 'ahooks'
import SharingModalTabs from './SharingModalTabs'


const MapSharingModal: FC = () => {
  const { t } = useTranslation('map')

  const [isModalVisible, { setTrue: showModal, setFalse: hideModal }] = useBoolean()

  return (
    <Fragment>
      <Button
        type="link"
        style={{
          color: 'black',
        }}
        onClick={showModal}
      >
        {t('embed')}
      </Button>

      <Modal
        visible={isModalVisible}
        closable={false}
        footer={null}
        onCancel={hideModal}
      >
        <SharingModalTabs
          hideModal={hideModal}
        />
      </Modal>

    </Fragment>
  )
}

export default MapSharingModal

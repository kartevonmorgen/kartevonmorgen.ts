import React from 'react'
import { Collapse, Modal } from 'antd'
import { DuplicatePayload } from './EntryForm'

type DuplicateModalPropsType = {
  duplicate: DuplicatePayload[]
  showModal: boolean
  setShowModal: (value: boolean) => void
  HandlerModal: () => void
}


export const DuplicateModal: React.FC<DuplicateModalPropsType> = (props) => {

  const {duplicate, showModal, setShowModal, HandlerModal} = props;

  const { Panel } = Collapse;

  const handleOk = () => {
    HandlerModal()
  }
  const handleCancel = () => {
    setShowModal(false)
  }

   return (
      <>
        <Modal title="Found matches"
               centered
               visible={showModal}
               onOk={handleOk}
               onCancel={handleCancel}
               width={'500px'}
        >
          <Collapse>
          {
            duplicate.map(d => <Panel header={d.title} key={d.id}>
              <p>{d.description}</p>
              </Panel>
            )
          }
          </Collapse>
        </Modal>
      </>
   )
}

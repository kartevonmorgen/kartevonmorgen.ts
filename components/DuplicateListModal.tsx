import { Collapse, Modal } from 'antd'
import { DuplicatePayload } from './EntryForm'
import { FC } from 'react'

interface DuplicateListModalProps {
  duplicate: DuplicatePayload[]
  showModal: boolean
  setShowModal: (value: boolean) => void
  HandlerModal: () => void
}


const DuplicateListModal: FC<DuplicateListModalProps> = (props) => {

  const { duplicate, showModal, setShowModal, HandlerModal } = props

  const { Panel } = Collapse

  const handleOk = () => {
    HandlerModal()
  }
  const handleCancel = () => {
    setShowModal(false)
  }

  return (
    <Modal title='Found matches'
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
            </Panel>,
          )
        }
      </Collapse>
    </Modal>
  )
}


export default DuplicateListModal
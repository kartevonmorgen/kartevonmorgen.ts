import { Modal } from 'antd'
import Image from 'next/image'

export const InfoModal = (props: any) => {

  const handleOk = () => {
    props.setShowModalInfo(false)
  }

  const handleCancel = () => {
    props.setShowModalInfo(false)
  }
  return <>
    <Modal width={'700px'}
           title='Image URL'
           style={{
             top: '50px',
           }}
           visible={props.showModalInfo} onOk={handleOk} onCancel={handleCancel}>
      <div style={{
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'flex-start',
      }}>
        <Image
          width={450}
          layout='intrinsic'
          height={270}
          src={'/assets/img/modal/modal.png'}
          alt='Instruction'
        />
        <div style={{
          marginTop: '-5px',
          width: '230px',
          paddingLeft: '23px',
        }}>
          You can get the URL-address of any image in the web
          by just clicking on it to open the context menu and choose
          "Copy image address"
        </div>
      </div>
    </Modal>
  </>

}
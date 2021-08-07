import { Modal } from 'antd'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'

type ImageURlTutorialModalPropsType = {
  setShowModalInfo: (value: boolean) => void
  showModalInfo: boolean
}
export const ImageURlTutorialModal = (props: ImageURlTutorialModalPropsType) => {
  const { t } = useTranslation('map')
  const handleOk = () => {
    props.setShowModalInfo(false)
  }

  const handleCancel = () => {
    props.setShowModalInfo(false)
  }
  return <Modal width={'700px'}
                title='URL'
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
        {
          t('entryForm.InfoHowToCopyURL')
        }
      </div>
    </div>
  </Modal>
}
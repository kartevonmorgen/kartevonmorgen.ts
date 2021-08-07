import { Modal } from 'antd'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import { FC } from 'react'

interface ImageURlTutorialModalProps {
  setShowModalInfo: (value: boolean) => void
  showModalInfo: boolean
}

const ImageURlTutorialModal: FC<ImageURlTutorialModalProps> = (props) => {
  const { setShowModalInfo, showModalInfo } = props
  const { t } = useTranslation('map')

  const handleOk = () => {
    setShowModalInfo(false)
  }

  const handleCancel = () => {
    setShowModalInfo(false)
  }
  return <Modal width={'700px'}
                title={t('entryForm.tutorialModalTitle')}
                style={{
                  top: '50px',
                }}
                visible={showModalInfo} onOk={handleOk} onCancel={handleCancel}>
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
export default ImageURlTutorialModal
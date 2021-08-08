import { Button, Modal, notification, Tooltip } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { stackoverflowLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { convertBBoxToString ,validateEmail } from '../utils/utils'
import { useMap } from 'react-leaflet'
import { AxiosInstance } from '../api'
import { BASICS_ENDPOINTS } from '../api/endpoints/BasicsEndpoints'
import useTranslation from 'next-translate/useTranslation'
import TagsSelect from './TagsSelect'

const getIframeCode = (url) => {
  return (
    `<div style="text-align: center;"> 
<iframe style="display: inline-block; border: none" src="${url}"
 width="100%" height="580"> 
<a href="${url}" target="_blank">zur karte</a>
</iframe></div> <p style="text-align: right;">
<a href="${url}" 
target="_blank" rel="noreferrer noopener" aria-label=" (öffnet in neuem Tab)">
Открыть большую карту
</a></p>`
  )
}


export enum MapModalMode {
  SUBSCRIPTION="subscription",
  EMBED="embed"
}


interface ModalComponentProps {
  isModalVisible: boolean
  setIsModalVisible: (value) => void
  mode: MapModalMode
}

export const MapShareModal:FC<ModalComponentProps> = (props) => {

  //common handlers

  const handleOk = () => {
    props.setIsModalVisible(false)
  }

  const handleCancel = () => {
    props.setIsModalVisible(false)
  }

  const chooseModal = (mode) => {
    switch (mode) {
      case MapModalMode.EMBED : {
        return <Embed handleOk={handleOk} handleCancel={handleCancel} isModalVisible={props.isModalVisible} />
      }
      case MapModalMode.SUBSCRIPTION: {
        return <Subscribe handleOk={handleOk} handleCancel={handleCancel} isModalVisible={props.isModalVisible}/>
      }
      default :
        return null
    }
  }

  return chooseModal(props.mode)
}



// Variations for Modals

interface ModalVariationProps{
  isModalVisible:boolean
  handleCancel:() => void
  handleOk:() => void
}

const Embed:FC<ModalVariationProps> = (props) => {

  const [url, setUrl] = useState<string>('')

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

return (
  <Modal visible={props.isModalVisible} width={'800px'} key={"embed-modal"} onCancel={props.handleCancel}
         footer={[<FooterEmbed key={"embed-footer"} handleCancel={props.handleCancel} handleOk={props.handleOk} url={url}/>]}>
    <div style={{marginTop:"30px"}}>
      <SyntaxHighlighter language="javascript" style={stackoverflowLight}>
        {getIframeCode(url)}
      </SyntaxHighlighter>
    </div>
  </Modal>
)
}

const Subscribe:FC<ModalVariationProps> = (props) => {

  const { t } = useTranslation('map')

  const titleOptions = [
    {
      label: t('modal.subscribe.enterType.all'),
      value: 'new',
    },
    {
      label: t('modal.subscribe.enterType.upd'),
      value: 'all',
    },
  ]

  const [email, setEmail] = useState('')
  const [frequency, setFrequency] = useState('week')
  const [currentType, setCurrentType] = useState(titleOptions[0])
  const [arrayOfTags, setArrayOfTags] = useState([])
  const [error, setError] = useState({
    errorMail: false,
    errorTags: false
  })

  const map = useMap()
  const bbox = convertBBoxToString(map.getBounds()).split(',')

  const handlerRadioChange = (label) => {
    titleOptions.forEach((el, index) => {
      if (el.label === label) setCurrentType(el)
    })
  }

  const handlerEmailChange = (e) => {
    setError({...error,errorMail:false})
    setEmail(e.currentTarget.value)
  }

  const getData = () => {
    return {
      email: email,
      changeType: currentType.value,
      tags: arrayOfTags,
      frequency: frequency,
      bbox: {
        lat1: bbox[0],
        lng1: bbox[1],
        lat2: bbox[2],
        lng2: bbox[3],
      },
    }
  }

  const validateData = () => {
    let errorLocal = false
    if(!validateEmail(email)){
      errorLocal = true
      setError({...error,errorMail:true})
    }
    else if(!(arrayOfTags.length >= 1)){
      errorLocal = true
      setError({...error,errorTags:true})
    }
    else{
      setError({...error,errorTags:false})
    }

    if (!errorLocal) goSubscribe(getData())

  }

  const goSubscribe = (data) => {
    AxiosInstance.PostRequest(BASICS_ENDPOINTS.postSubscribe(),data)
      .then(res => console.log(res))
      .catch((error) => console.log(error))
  }

  return (
    <Modal visible={props.isModalVisible} width={'500px'} className={'modal-subscribe'} onCancel={props.handleCancel}
           footer={[<FooterSubscribe handleCancel={props.handleCancel} handleOk={() => validateData()}
                                     key={"subscribe-modal"} />]}>
      <div className={'input-container'}>
        <span className={'text'}>{t('modal.subscribe.enterEmail')}</span>
        {error.errorMail && <span className={'error-text'}>{t('modal.subscribe.errorEmail')}</span>}
        <input className={`input ${error.errorMail && 'error'}`}
               value={email}
               onChange={handlerEmailChange} />

        <span className={'text'}>{t('modal.subscribe.enterTags')}</span>
        {error.errorTags && <span className={'error-text'}>{t('modal.subscribe.errorEmail')}</span>}
        <TagsSelect
          setTagsCallback={(arrayOfTags) => {setArrayOfTags(arrayOfTags)}}
        />
        <span className={'text-margin'}>{t('modal.subscribe.enterFrequency.question')}</span>
        <select className={'select'} value={frequency} onChange={(e) => {
          setFrequency(e.target.value)
        }}>
          <option>{t('modal.subscribe.enterFrequency.hour')}</option>
          <option>{t('modal.subscribe.enterFrequency.day')}</option>
          <option>{t('modal.subscribe.enterFrequency.week')}</option>
        </select>
        <span className={'text-margin'}>{t('modal.subscribe.enterType.question')}</span>
      </div>

      <div className={'checkbox-container'}>
        {titleOptions.map((el, index) => {
          return (
            <label className={'label-flex'} key={index+el.label}>
              <input type="radio" className="option-input radio" name="type"
                     checked={currentType.label === el.label}
                     onChange={() => handlerRadioChange(el.label)} key={index + el.label} />
              {el.label}
            </label>
          )
        })}
      </div>
    </Modal>
  )
}

// Footer for Modals

interface FooterType {
  handleCancel: () => void
  handleOk: () => void
  url?: string
}

const FooterEmbed:FC<FooterType> = (props) => {

  const { t } = useTranslation('map')

  const showNotification = () => {
    notification.open({
      message: t('growler.linkCopied'),
    });
  }

  return (
    <div className={'modal-footer-embed'} >
      <Button  onClick={props.handleCancel} className={'footer-button-embed'}>
        <FontAwesomeIcon icon="ban" color="black" />
        <span className={'button-text'}>{t('modal.locate.close')}</span>
      </Button>
      <Button  onClick={props.handleOk} href={'https://blog.vonmorgen.org/iframes/'}
              className={'footer-button-embed'}>
        {t("modal.embed.findOutMore")}
      </Button>
      <CopyToClipboard text={getIframeCode(props.url)}>
        <Button className={'footer-button-embed'} onClick={() => {showNotification()}}>
          <FontAwesomeIcon icon="copy" color="black" />
          <span className={'button-text'}>{t('copy')}</span>
        </Button>
      </CopyToClipboard>
    </div>)
}
const FooterSubscribe:FC<FooterType> = (props) => {

  const { t } = useTranslation('map')

  return (
    <div className={'modal-footer-subscribe'} >
      <Tooltip placement="left" title={"Now it not working 0_0 Sorry"}>
      <Button  onClick={props.handleOk} className={'footer-button-subscribe'} disabled={true}>
        <FontAwesomeIcon icon="envelope" color="black" />
        <span className={'button-text'}>{t('subscribe')}</span>
      </Button>
      </Tooltip>

      <Button className={'footer-button-subscribe'} onClick={props.handleCancel}>
        <FontAwesomeIcon icon="ban" color="black" />
        <span className={'button-text'}>{t('modal.locate.close')}</span>
      </Button>
    </div>)
}

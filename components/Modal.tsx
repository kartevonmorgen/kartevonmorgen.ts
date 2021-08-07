import { Button, Modal, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { stackoverflowLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { convertBBoxToString, uniqId, validateEmail } from '../utils/utils'
import SearchTags from './SearchTags'
import { useMap } from 'react-leaflet'
import { AxiosInstance } from '../api/RequestHandler'
import { BASICS_ENDPOINTS } from '../api/endpoints/BasicsEndpoints'

interface ModalComponentType {
  isModalVisible: boolean
  setIsModalVisible: (value) => void
  mode: string
}

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



export const ModalComponent: (props: ModalComponentType) => JSX.Element = (props: ModalComponentType) => {

  //common handlers

  const handleOk = () => {
    props.setIsModalVisible(false)
  }

  const handleCancel = () => {
    props.setIsModalVisible(false)
  }

  // embed

  const [url, setUrl] = useState<string>('')

  useEffect(() => {
    if (props.mode === 'embed') setUrl(window.location.href)
  }, [])

  // subscribe

  const titleOptions = [
    {
      label: 'Report only new entries',
      value: 'new',
    },
    {
      label: 'Report new entries and updates to existing entries',
      value: 'all',
    },
  ]
  const map = useMap()
  const bbox = convertBBoxToString(map.getBounds()).split(',')

  const [email, setEmail] = useState('')
  const [frequency, setFrequency] = useState('week')
  const [currentType, setCurrentType] = useState(titleOptions[0])
  const [arrayOfTags, setArrayOfTags] = useState([])
  const [error, setError] = useState({
    errorMail: false,
    errorTags: false
  })

  const handlerRadioChange = (label) => {
    titleOptions.forEach((el, index) => {
      if (el.label === label) setCurrentType(el)
    })
  }

  const handlerEmailChange = (e) => {
    setError({...error,errorMail:false})
    setEmail(e.currentTarget.value)
  }

  function validateTags(array) {
    return array.length >= 1
  }

  function validateData(){
    let errorLocal = false
    if(!validateEmail(email)){
      errorLocal = true
      setError({...error,errorMail:true})
    }
    else if(!validateTags(arrayOfTags)){
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

  function getData() {
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


  const chooseModal = (mode) => {
    switch (mode) {
      case 'embed' : {
        return (
          <Modal visible={props.isModalVisible} width={'800px'} key={uniqId()} onCancel={handleCancel}
                 footer={[<FooterEmbed handleCancel={handleCancel} handleOk={handleOk} key={uniqId()} url={url}/>]}>
            <SyntaxHighlighter language="javascript" style={stackoverflowLight}>
              {getIframeCode(url)}
            </SyntaxHighlighter>
          </Modal>
        )
      }
      case 'subscribe' : {
        return (
          <Modal visible={props.isModalVisible} width={'500px'} className={'modal-subscribe'} onCancel={handleCancel}
                 footer={[<FooterSubscribe handleCancel={handleCancel} handleOk={() => validateData()}
                                           key={uniqId()} />]}>
            <div className={'input-container'}>
              <span className={'text'}>Please enter your email</span>
              {error.errorMail && <span className={'error-text'}>Email is not correctly</span>}
              <input className={`input ${error.errorMail && 'error'}`}
                     value={email}
                     onChange={handlerEmailChange} />

              <span className={'text'}>Please enter tags for your subscribe</span>
              {error.errorTags && <span className={'error-text'}> Select at least 1 tag</span>}
              <SearchTags optionsCount={arrayOfTags} addOptionCount={setArrayOfTags} />
              <span className={'text-margin'}>Please choose report frequency</span>
              <select className={'select'} value={frequency} onChange={(e) => {
                setFrequency(e.target.value)
              }}>
                <option>hour</option>
                <option>day</option>
                <option>week</option>
              </select>
              <span className={'text-margin'}>Please choose type of report</span>
            </div>

            <div className={'checkbox-container'}>
              {titleOptions.map((el, index) => {
                return (
                  <label className={'label-flex'}>
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
      default :
        return null
    }
  }

  return chooseModal(props.mode)
}

// Footer for Modals

interface FooterType {
  handleCancel: () => void
  handleOk: () => void
  url?: string
}

const FooterEmbed: (props: FooterType) => JSX.Element = (props: FooterType) => {

  const showNotification = () => {
    notification.open({
      message: 'IFrame copied to clipboard successfully!',
    });
  }

  return (
    <div className={'modal-footer-embed'} key={uniqId()}>
      <Button key={uniqId()} onClick={props.handleCancel} className={'footer-button-embed'}>
        <FontAwesomeIcon icon="ban" color="black" />
        <span className={'button-text'}>Back</span>
      </Button>
      <Button key={uniqId()} onClick={props.handleOk} href={'https://blog.vonmorgen.org/iframes/'}
              className={'footer-button-embed'}>
        What to do about it
      </Button>
      <CopyToClipboard text={getIframeCode(props.url)}>
        <Button key={uniqId()} className={'footer-button-embed'} onClick={() => {showNotification()}}>
          <FontAwesomeIcon icon="copy" color="black" />
          <span className={'button-text'}>Copy</span>
        </Button>
      </CopyToClipboard>
    </div>)
}
const FooterSubscribe: (props: FooterType) => JSX.Element = (props: FooterType) => {
  return (
    <div className={'modal-footer-subscribe'} key={uniqId()}>
      <Button key={uniqId()} onClick={props.handleOk} className={'footer-button-subscribe'}>
        <FontAwesomeIcon icon="envelope" color="black" />
        <span className={'button-text'}>Subscribe</span>
      </Button>

      <Button key={uniqId()} className={'footer-button-subscribe'} onClick={props.handleCancel}>
        <FontAwesomeIcon icon="ban" color="black" />
        <span className={'button-text'}>Close</span>
      </Button>
    </div>)
}


import { FC, Fragment } from 'react'
import { useRouter } from 'next/router'
import axios, { AxiosError } from 'axios'
import { Modal, Button, Typography, Form, Input, Radio, Divider, message } from 'antd'
import { MessageInstance } from 'antd/es/message/interface'
import { useBoolean } from 'ahooks'
import useTranslation from 'next-translate/useTranslation'
import { Translate } from 'next-translate'
import { validate as validateEmail } from 'isemail'
import { useMap } from 'react-leaflet'
import { AxiosInstance } from '../api'
import API_ENDPOINTS from '../api/endpoints'
import { convertQueryParamToArray, convertBBoxToCoords } from '../utils/utils'
import { SubscriptionRequest } from '../dtos/SubscriptionRequest'


const { useForm } = Form
const { Text } = Typography


const onSubscribe = async (
  t: Translate,
  messageApi: MessageInstance,
  values: any,
  lang: string,
  bbox: [number, number, number, number],
  tags: string[],
  ) => {
    const {
      title,
      changeType,
      frequency,
      email
    } = values

    const [lat1, lng1, lat2, lng2] = bbox

  const req: SubscriptionRequest = {
    title,
      changeType,
      frequency,
      bbox: {
        lat1,
        lng1,
        lat2,
        lng2
      },
      tags,
      email,
      lang,
  }

  try {
    const res = await AxiosInstance.PostRequest(
      API_ENDPOINTS.postSubscription(),
      req,
    )
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.status === 422) {
        messageApi.error(e.response?.data?.message)
        return
      }

      messageApi.error(t('growler.genericError'))
      return
    }
  }

  messageApi.success(t('growler.subscriptionAdded'))
}


const SubscriptionModal: FC = () => {
  const [isModalVisible, { setTrue: showModal, setFalse: hideModal }] = useBoolean()

  const { t } = useTranslation('map')

  const router = useRouter()
  const {
    query: {
      tag: tagQueryParam,
    },
    locale
  } = router

  const [messageApi, contextHolder] = message.useMessage()

  const tagsFromURL: string[] = convertQueryParamToArray(tagQueryParam)
  const language  = locale || 'en'

  const map = useMap()
  const bbox = map.getBounds()
  const coords = convertBBoxToCoords(bbox)

  const [form] = useForm()

  return (
    <Fragment>
      {contextHolder}
      <Button
        type="link"
        style={{
          color: 'black',
        }}
        onClick={showModal}
      >
        {t('subscribeToBbox.subscribe')}
      </Button>
      <Modal
        open={isModalVisible}
        closable={false}
        onCancel={hideModal}
        title={t('subscribeToBbox.newSubscription.heading')}
        centered
        destroyOnClose
        okButtonProps={{
          htmlType: 'submit',
          form: 'subscription-form'
        }}
      >
        <Text>{t('subscribeToBbox.newSubscription.text1')}</Text>
        <Text>{t('subscribeToBbox.newSubscription.text2')}</Text>

        <Divider />

        <Form
          id='subscription-form'
          size="middle"
          style={{
            marginTop: 8,
          }}
          form={form}
          onFinish={(values) => onSubscribe(t, messageApi, values, language, coords, tagsFromURL)}
        >
          <Form.Item
            name="title"
            label={t('subscribeToBbox.subscriptionName')}
            required
          >
            <Input
              placeholder={t('subscribeToBbox.subscriptionName')}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={t('entryForm.email')}
            required
            rules={[
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.resolve()
                  }

                  const trimmedValue: string = value.trim()

                  if (validateEmail(trimmedValue)) {
                    return Promise.resolve()
                  }

                  return Promise.reject(new Error('not a valid email'))
                },
              },
            ]}
          >
            <Input
              placeholder={t('entryForm.email')}
            />
          </Form.Item>

          <Form.Item
            name="frequency"
            label={t("subscribeToBbox.frequencies.frequency")}
          >
            <Radio.Group defaultValue="week">
              <Radio value="hour">{t("subscribeToBbox.frequencies.hour")}</Radio>
              <Radio value="day">{t("subscribeToBbox.frequencies.day")}</Radio>
              <Radio value="week">{t("subscribeToBbox.frequencies.week")}</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="type"
            label={t("subscribeToBbox.changeType.type")}
          >
            <Radio.Group defaultValue="new">
              <Radio value="new">{t("subscribeToBbox.changeType.new")}</Radio>
              <Radio value="all">{t("subscribeToBbox.changeType.all")}</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  )
}


export default SubscriptionModal

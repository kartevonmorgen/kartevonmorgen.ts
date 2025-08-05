import { FC, Fragment } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
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
  language: string,
  bbox: [number, number, number, number],
  tags: string[],
) => {
  const {
    title,
    changeType,
    interval,
    email
  } = values

  const [lat_min, lon_min, lat_max, lon_max] = bbox

  const req: SubscriptionRequest = {
    title,
    lat_min,
    lon_min,
    lat_max,
    lon_max,
    interval,
    subscription_type: changeType,
    email,
    language: 'de',
  }

  console.log('Subscription request:', req)

  if (changeType === 'all') {
    req.subscription_type = 'updates'
  }

  try {
    const res = await AxiosInstance.PostRequest(
      API_ENDPOINTS.postSubscription(),
      req,
    )
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.response?.status === 409) {
        messageApi.error(t('growler.similarSubscriptionExists'))
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
  const language = locale || 'de'

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
          initialValues={{
            changeType: 'creates',
            interval: 'daily',
          }}
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
            name="interval"
            label={t("subscribeToBbox.frequencies.frequency")}
            required
          >
            <Radio.Group
              defaultValue="daily"
            >
              <Radio value="daily">{t("subscribeToBbox.frequencies.day")}</Radio>
              <Radio value="weekly">{t("subscribeToBbox.frequencies.week")}</Radio>
              <Radio value="monthly">{t("subscribeToBbox.frequencies.month")}</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="changeType"
            label={t("subscribeToBbox.changeType.type")}
            required
          >
            <Radio.Group defaultValue="create">
              <Radio value="creates">{t("subscribeToBbox.changeType.new")}</Radio>
              <Radio value="updates">{t("subscribeToBbox.changeType.update")}</Radio>
              <Radio value="all">{t("subscribeToBbox.changeType.all")}</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  )
}


export default SubscriptionModal

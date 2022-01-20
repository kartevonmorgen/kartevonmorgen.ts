import { FC, useEffect } from 'react'
import { SearchEntryID } from '../dtos/SearchEntry'
import { SlugVerb } from '../utils/types'
import { NextRouter, useRouter } from 'next/router'
import { Button, Form, Input, PageHeader, Radio, Space, Typography } from 'antd'
import useTranslation from 'next-translate/useTranslation'
import { NewRating } from '../dtos/NewRating'
import { AxiosInstance } from '../api'
import API_ENDPOINTS from '../api/endpoints'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'
import { RatingFactor } from '../dtos/RatingFactor'
import { deleteSlugLevelsFromRouter } from '../utils/router'


const { useForm } = Form
const { TextArea } = Input
const { Link, Paragraph, Text } = Typography


interface EntryRatingFormProps {
  entryId: SearchEntryID
  verb: SlugVerb.EDIT | SlugVerb.CREATE
}

const redirectToEntryDetail = (router: NextRouter) => () => {
  const newQueryParams = deleteSlugLevelsFromRouter(2, router)

  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  router.replace(
    {
      pathname: `/m/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )
}


const onCreate = async (newRating: NewRating): Promise<null> => {
  const response = await AxiosInstance.PostRequest<null>(
    API_ENDPOINTS.postEntryRating(),
    newRating,
  )

  return response.data
}


const onFinish = (router: NextRouter) => async (entryRatingValues: any) => {
  try {
    await onCreate(entryRatingValues)

    redirectToEntryDetail(router)()
  } catch (e) {
    // todo: show an error notification
    console.error(e)
  }
}


const EntryRatingForm: FC<EntryRatingFormProps> = (props) => {
  const { entryId } = props

  const router = useRouter()

  const { t } = useTranslation('map')

  const [form] = useForm<NewRating>()

  useEffect(() => {
    form.setFieldsValue({
      entry: entryId,
    })
  }, [entryId])


  return (
    <div
      style={{
        paddingBottom: 60,
      }}
    >
      <PageHeader
        style={{
          paddingLeft: 4,
          paddingRight: 4,
          paddingTop: 0,
          paddingBottom: 4,
        }}
        title={t('ratingForm.newRating')}
        ghost={false}
        onBack={redirectToEntryDetail(router)}
      />

      <Form
        layout="vertical"
        size="middle"
        onFinish={onFinish(router)}
        form={form}
        style={{
          paddingLeft: 8,
          paddingRight: 8,
        }}
      >

        <Paragraph>
          <Text>
            {t('ratingForm.introText')}
          </Text>
          <Link
            href="http://bildungsagenten.org/kartevonmorgen/2/"
          >
            {` ${t('ratingForm.moreInfoLink')}`}
          </Link>
        </Paragraph>

        <Form.Item name="entry" hidden>
          <Input value={entryId} disabled/>
        </Form.Item>

        <Form.Item
          name="context"
          label={<Text strong>{t('ratingForm.chooseContext')}:</Text>}
          rules={[{ required: true, message: 'Please pick an item!' }]}
        >
          <Radio.Group>
            <Space direction="vertical">

              {
                Object.keys(RatingFactor).map((ratingFactor) => (
                  <Radio
                    key={`entry-rating-form-rating-factor-${ratingFactor}`}
                    value={ratingFactor}
                  >
                    <Text strong>{t(`ratings.contextName.${ratingFactor}`)}</Text>
                    <Paragraph type="secondary">{t(`ratings.contextExplanation.${ratingFactor}`)}</Paragraph>
                  </Radio>
                ))
              }

            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="title"
          rules={[{ required: true, min: 3, max: 40 }]}
        >
          <Input placeholder={t('ratingForm.title')}/>
        </Form.Item>

        <Form.Item
          name="comment"
          rules={[{ required: true, min: 10, max: 500 }]}
        >
          <TextArea placeholder={t('ratingForm.comment')}/>
        </Form.Item>

        <Form.Item
          name="source"
        >
          <Input placeholder={t('ratingForm.reference')}/>
        </Form.Item>

        <Form.Item
          name="value"
          label={<Text strong>{t('ratings.rating-heading')}:</Text>}
          rules={[{ required: true, message: 'Please pick an item!' }]}
        >
          <Radio.Group>
            <Space direction="vertical">
              <Radio value={2}>
                <Text>{`${t('ratings.valueName.two')} (${t('ratings.valueNameExplanation.two')})`}</Text>
              </Radio>

              <Radio value={1}>
                <Text>{`${t('ratings.valueName.one')} (${t('ratings.valueNameExplanation.one')})`}</Text>
              </Radio>

              <Radio value={0}>
                <Text>{`${t('ratings.valueName.zero')} (${t('ratings.valueNameExplanation.zero')})`}</Text>
              </Radio>

              <Radio value={-1}>
                <Text>{`${t('ratings.valueName.minusOne')} (${t('ratings.valueNameExplanation.minusOne')})`}</Text>
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: '100%',
          }}
        >
          Submit
        </Button>

      </Form>
    </div>
  )
}


export default EntryRatingForm

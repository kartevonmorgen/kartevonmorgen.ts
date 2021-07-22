import React, { FC } from 'react'
import { SearchEntryID } from '../dtos/SearchEntry'
import { SlugVerb } from '../utils/types'
import { useRouter } from 'next/router'
import { Form, Input, Radio, Space, Typography } from 'antd'
import useTranslation from 'next-translate/useTranslation'
import { RatingID } from '../dtos/Rating'
import { NewRating } from '../dtos/NewRating'


const { useForm } = Form
const { TextArea } = Input
const { Link, Paragraph, Text } = Typography


interface EntryRatingCommentFormProps {
  entryId: SearchEntryID
  ratingId: RatingID
  verb: SlugVerb.CREATE
}


const EntryRatingCommentForm: FC<EntryRatingCommentFormProps> = (props) => {
  const {
    entryId,
    ratingId,
    verb,
  } = props

  const router = useRouter()

  const { t } = useTranslation('map')

  const [form] = useForm<NewRating>()


  return (
    <Form
      layout="vertical"
      size="middle"
      style={{
        marginTop: 8,
        paddingBottom: 60,
      }}
      onFinish={(values) => {
        console.log(values)
      }}
      form={form}
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

      <Form.Item name="id" hidden>
        <Input disabled/>
      </Form.Item>

      <Form.Item
        name="context"
        label={<Text strong>{t('ratingForm.chooseContext')}:</Text>}
        rules={[{ required: true, message: 'Please pick an item!' }]}
      >
        <Radio.Group>
          <Space direction="vertical">
            <Radio value="diversity">
              <Text strong>{t('ratings.contextName.diversity')}</Text>
              <Paragraph type="secondary">{t('ratings.contextExplanation.diversity')}</Paragraph>
            </Radio>
            <Radio value="renewable">
              <Text strong>{t('ratings.contextName.renewable')}</Text>
              <Paragraph type="secondary">{t('ratings.contextExplanation.renewable')}</Paragraph>
            </Radio>
            <Radio value="fairness">
              <Text strong>{t('ratings.contextName.fairness')}</Text>
              <Paragraph type="secondary">{t('ratings.contextExplanation.fairness')}</Paragraph>
            </Radio>
            <Radio value="humanity">
              <Text strong>{t('ratings.contextName.humanity')}</Text>
              <Paragraph type="secondary">{t('ratings.contextExplanation.humanity')}</Paragraph>
            </Radio>
            <Radio value="solidarity">
              <Text strong>{t('ratings.contextName.solidarity')}</Text>
              <Paragraph type="secondary">{t('ratings.contextExplanation.solidarity')}</Paragraph>
            </Radio>
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

    </Form>
  )
}


export default EntryRatingCommentForm
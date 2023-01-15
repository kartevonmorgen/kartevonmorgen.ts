import { FC, Fragment, useEffect } from 'react'
import { SearchEntryID } from '../dtos/SearchEntry'
import { SlugVerb } from '../utils/types'
import { NextRouter, useRouter } from 'next/router'
import { Button, Comment, Divider, Form, Input, PageHeader, Radio, Space, Typography } from 'antd'
import useTranslation from 'next-translate/useTranslation'
import { Rating, RatingID } from '../dtos/Rating'
import { NewRating } from '../dtos/NewRating'
import produce from 'immer'
import { convertQueryParamToArray } from '../utils/utils'
import useRequest from '../api/useRequest'
import API_ENDPOINTS from '../api/endpoints'
import { AxiosInstance } from '../api'
import isEmpty from 'lodash/isEmpty'
import { isWebUri } from 'valid-url'
import moment from 'moment'
import { mapRatingValueToTranslationKey } from '../utils/translation'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'


const { useForm } = Form
const { TextArea } = Input
const { Link, Paragraph, Text } = Typography


const redirectToEntryDetail = (router: NextRouter) => () => {
  const { query } = router
  const newQueryParams = produce(query, (draftState) => {
    const { slug } = draftState
    const slugArray = convertQueryParamToArray(slug)

    slugArray.splice(slugArray.length - 4, 4)
    draftState.slug = slugArray
  })

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


interface EntryRatingCommentFormProps {
  entryId: SearchEntryID
  ratingId: RatingID
  verb: SlugVerb.CREATE
}


const EntryRatingCommentForm: FC<EntryRatingCommentFormProps> = (props) => {
  const {
    entryId,
    ratingId,
  } = props

  const router = useRouter()

  const { t } = useTranslation('map')

  const { data: ratings, error: ratingsError } = useRequest<Rating[]>(
    {
      url: `${API_ENDPOINTS.getRatings()}/${ratingId}`,
    },
  )

  const [form] = useForm<NewRating>()

  useEffect(() => {
    form.setFieldsValue({
      entry: entryId,
    })
  }, [entryId])

  if (ratingsError) {
    //  todo: show error notification and redirect to the entry detail
    return null
  }

  if (!ratings) {
    //  todo: still loading show the spinner
    return null
  }

  if (ratings.length === 0) {
    // todo: no ratings found, show notification and redirect to the entry detail
    return null
  }

  const parentRating = ratings[0]
  // const comment = parentRating.comments[0]

  form.setFieldsValue({
    title: parentRating.title,
    context: parentRating.context,
  })

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
        title={t('commentForm.newComment')}
        ghost={false}
        onBack={redirectToEntryDetail(router)}
      />

      <Form
        layout="vertical"
        size="middle"
        style={{
          marginTop: 8,
          paddingBottom: 60,
        }}
        onFinish={onFinish(router)}
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

        <Paragraph strong>
          {t('commentForm.chooseContext')}:
        </Paragraph>

        <Comment
          key={`rating-${parentRating.id}`}
          style={{ paddingTop: 8 }}
          content={
            <Fragment>
              <Text strong>{t(`ratings.contextName.${parentRating.context}`)}</Text>

              <div
                style={{ paddingLeft: 10 }}
              >
                <Text>{t(`ratings.valueName.${mapRatingValueToTranslationKey(parentRating.value)}`)}: </Text>
                <Text strong>{parentRating.title}</Text>

                {
                  !isEmpty(parentRating.source) &&
                  <Fragment>
                    <Divider type="vertical"/>

                    {
                      isWebUri(parentRating.source) ? (
                        <Link
                          href={parentRating.source}
                          target="_blank"
                        >
                          {t('ratings.sourceWebsite')}
                        </Link>
                      ) : (
                        <Text type="secondary">{parentRating.source}</Text>
                      )
                    }
                  </Fragment>
                }
              </div>

            </Fragment>
          }
          datetime={moment.unix(parentRating.created).fromNow()}
        />

        <Form.Item name="entry" hidden>
          <Input disabled/>
        </Form.Item>

        <Form.Item name="context" hidden>
          <Input disabled/>
        </Form.Item>

        <Form.Item name="title" hidden>
          <Input disabled/>
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


export default EntryRatingCommentForm

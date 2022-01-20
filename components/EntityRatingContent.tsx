import { FC, Fragment } from 'react'
import isEmpty from 'lodash/isEmpty'
import { Divider, Typography } from 'antd'
import { isWebUri } from 'valid-url'
import { mapRatingValueToKey } from '../utils/ratings'
import useTranslation from 'next-translate/useTranslation'


const { Text, Link, Paragraph } = Typography


interface EntityRatingContentProps {
  value: number
  title: string
  text: string
  source?: string
}

const EntityRatingContent: FC<EntityRatingContentProps> = (props) => {

  const { source, title, text, value } = props

  const { t } = useTranslation('map')

  const ratingValueName = t(`ratings.valueName.${mapRatingValueToKey(value)}`)

  return (
    <Fragment>
      <Text>{`${ratingValueName}: `}</Text>
      <Text strong>{title}</Text>
      <Paragraph
        style={{
          marginBottom: '0.01em',
        }}
      >

        {text}

        {
          !isEmpty(source) &&
          <Fragment>
            <Divider type="vertical"/>

            {
              isWebUri(source) ? (
                <Link
                  href={source}
                  target="_blank"
                >
                  {t('ratings.sourceWebsite')}
                </Link>
              ) : (
                <Text type="secondary">{source}</Text>
              )
            }
          </Fragment>
        }

      </Paragraph>
    </Fragment>
  )
}


export default EntityRatingContent
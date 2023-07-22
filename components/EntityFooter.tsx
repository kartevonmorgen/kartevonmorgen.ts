import { FC, Fragment, useEffect, useState } from 'react'
import { Col, Divider, Layout, Row, Tooltip, Typography } from 'antd'
import moment from 'moment'
import { useSize } from 'ahooks'
import { gold } from '@ant-design/colors'
import useTranslation from 'next-translate/useTranslation'
import { RootSlugEntity } from '../utils/types'
import { mapEntityToOFDB } from '../api/endpoints'
import createMailToHref from '../utils/mailto'


const { Footer } = Layout
const { Link, Text } = Typography


interface EntityFooterProps {
  entityId: string
  type: RootSlugEntity.EVENT | RootSlugEntity.ENTRY
  title: string
  activeLink: string
  created_at: number
  version?: number
}


const EntityFooter: FC<EntityFooterProps> = (props) => {
  const {
    entityId,
    type,
    title,
    activeLink,
    created_at,
    version,
  } = props

  const { t } = useTranslation('map')

  const footerSize = useSize(document.getElementById('entity-footer'))
  const footerHeight = footerSize?.height

  const entryDetailSize = useSize(document.getElementById('entity-detail'))
  const entityDetailHeight = entryDetailSize?.height

  const bodySize = useSize(document.querySelector('body'))
  const bodyHeight = bodySize?.height

  const [shouldStickAtBottom, setShouldStickAtBottom] = useState<boolean>(true)


  useEffect(() => {
    if (entityDetailHeight && footerHeight && bodyHeight) {
      if (entityDetailHeight + footerHeight > bodyHeight) {
        setShouldStickAtBottom(false)
      } else {
        setShouldStickAtBottom(true)
      }
    }
  }, [footerHeight, entityDetailHeight, bodyHeight])


  return (
    <Footer
      id="entity-footer"
      style={{
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 8,
        paddingBottom: 8,
        marginLeft: -16,
        marginRight: -16,
        marginTop: 16,
        position: shouldStickAtBottom ? 'absolute' : undefined,
        bottom: shouldStickAtBottom ? 0 : undefined,
        width: shouldStickAtBottom ? '100%' : undefined,
      }}
    >
      <Row
        justify="space-between"
      >
        <Col>
          <Link
            href={
              createMailToHref(
                process.env.NEXT_PUBLIC_KVM_REPORT_EMAIL as string,
                `Report for ${title}`,
                `This entry ${activeLink} is problematic because: `,
              )
            }
            target="_blank"
            rel="noreferrer noopener"
            style={{
              fontSize: '0.8em',
            }}
          >
            {t('entryDetails.reportLink')}
          </Link>
        </Col>

        <Col>
          <Text
            type="secondary"
            style={{
              fontSize: '0.8em',
            }}
          >
            {`${t('entryDetails.lastEdit')} ${moment.unix(created_at).fromNow()}`}
          </Text>

          {
            (version !== undefined) && (
              <Fragment>
                <Divider type="vertical"/>
                <Text
                  type="secondary"
                  style={{
                    fontSize: '0.8em',
                  }}
                >
                  v{version}
                </Text>
              </Fragment>
            )
          }
        </Col>
      </Row>

      <Tooltip
        title={t('entryDetails.viewHistoryTooltip')}
        color={gold.primary}
      >
        <Link
          href={`${mapEntityToOFDB[type]()}/${entityId}`}
          target="_blank"
          rel="noreferrer noopener"
          style={{
            fontSize: '0.8em',
          }}
        >
          {t('entryDetails.viewHistory')}
        </Link>
      </Tooltip>
    </Footer>
  )
}


export default EntityFooter

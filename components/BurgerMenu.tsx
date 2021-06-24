import { FC } from 'react'
import { useRouter } from 'next/router'
import useRequest from '../api/useRequest'
import { Button, Col, Dropdown, Menu as AntMenu, Row, Typography } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LinkPolicyToTargetAttributeMapper, LinkWithIcon } from '../dtos/LinkWithIcon'
import API_ENDPOINTS from '../api/endpoints'
import { getProjectNameFromQuery } from '../utils/slug'


const { Link } = Typography


const Menu: FC = () => {
  const router = useRouter()
  const { query } = router
  const projectName = getProjectNameFromQuery(query)


  const { data: linksWithIcon, error } = useRequest<LinkWithIcon[]>({
    url: API_ENDPOINTS.getBurgerMenuLinks(projectName),
  })

  if (error || !linksWithIcon) {
    console.error('failed to fetch burger menu links')

    return null
  }

  return (
    <AntMenu>
      {
        linksWithIcon.map(
          linkWithIcon => (
            <AntMenu.Item
              key={`burger-menu-item-${linkWithIcon.title}`}
            >
              <Row
                justify="space-between"
                gutter={32}
              >
                <Col>
                  <Link
                    href={linkWithIcon.link}
                    target={LinkPolicyToTargetAttributeMapper[linkWithIcon.policy]}
                    rel="noopener noreferrer"
                  >
                    {linkWithIcon.title}
                  </Link>
                </Col>

                <Col>
                  <FontAwesomeIcon icon={linkWithIcon.icon}/>
                </Col>
              </Row>
            </AntMenu.Item>
          ),
        )
      }
    </AntMenu>
  )
}


const BurgerMenu: FC = () => {
  return (
    <Dropdown
      overlay={<Menu/>}
      placement="bottomRight"
    >
      <Button>Burger Button</Button>
    </Dropdown>
  )
}


export default BurgerMenu
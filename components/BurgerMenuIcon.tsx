import { FC } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getProjectNameFromQuery } from '../utils/slug'


const BurgerMenuIcon: FC = () => {
  const router = useRouter()
  const { query } = router
  const projectName = getProjectNameFromQuery(query)

  return (
    <div
      style={{
        padding: 4,
        display: 'flex',
      }}
    >
      <img
        alt="burger menu icon"
        src={`/projects/${projectName}/icons/burger-menu-icon.webp`}
        height={25}
        width="auto"
        style={{
          display: 'block',
          marginRight: 8,
        }}
      />

      <FontAwesomeIcon
        icon="bars"
        style={{
          display: 'block',
          fontSize: '25',
        }}
      />
    </div>
  )
}

export default BurgerMenuIcon
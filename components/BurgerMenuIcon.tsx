import { FC } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getProjectNameFromQuery } from '../utils/slug'


const getPath = (projectName: string = 'main'): string => {
  return `/projects/${projectName}/icons/burger-menu-icon.webp`
}

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
        src={getPath(getPath(projectName))}
        height={25}
        width="auto"
        style={{
          display: 'block',
          marginRight: 8,
        }}
        onError={(event) => {
          (event.target as HTMLImageElement).src = getPath()
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

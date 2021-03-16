import { FC } from 'react'
import mainStyle from '../styles/main'


const projectToStyleMapper = {
  'main': mainStyle,
}

interface LayoutProps {
  project: string
}

const Layout: FC<LayoutProps> = (props) => {
  const { project } = props
  const globalStyle = projectToStyleMapper[project]

  return (
    <div className="page-layout">
      {props.children}

      <style jsx global>
        {globalStyle}
      </style>
    </div>
  )
}


export default Layout
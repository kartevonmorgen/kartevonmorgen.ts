import {FC, JSX, ReactNode} from 'react'
import PropTypes from 'prop-types'
import has from 'lodash/has'
import isString from 'lodash/isString'
import mainStyle, { createCategoryStyles } from '../styles/main'


const projectToStyleMapper: Record<string, JSX.Element> = {
  main: mainStyle,
}

interface CategoryColors {
  initiative?: string
  company?: string
  event?: string
}

interface LayoutProps {
  project?: string | object
  categoryColors?: CategoryColors
  children?: ReactNode
}

const Layout: FC<LayoutProps> = (props) => {
  const { categoryColors } = props
  
  let project: string = 'main'
  if (
    props.project &&
    isString(props.project) &&
    has(projectToStyleMapper, props.project)
  ) {
    project = props.project as string
  }

  // Use custom category colors if provided, otherwise use default styles
  const globalStyle = categoryColors 
    ? createCategoryStyles(categoryColors)
    : projectToStyleMapper[project]

  return (
    <div className="page-layout" style={{ overflowX: 'hidden', minHeight: '100vh' }}>
      {props.children}

      <style jsx global>
        {globalStyle}
      </style>
    </div>
  )
}


Layout.propTypes = {
  project: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  categoryColors: PropTypes.object,
}

Layout.defaultProps = {
  project: 'main',
}


export default Layout

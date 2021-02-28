import { Card } from 'antd'


const ResultCard = (props) => {
  const { children, cardProps } = props

  return (
    <Card
      {...cardProps}
    >
      {children}
    </Card>
  )
}

export default ResultCard
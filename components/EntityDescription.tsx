import { Dispatch, FC, useEffect, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { Button, Typography } from 'antd'
import { ENTITY_DETAIL_DESCRIPTION_LIMIT } from '../consts/texts'


const { Paragraph } = Typography


interface EntityDescriptionProps {
  text: string
}


const showFullDescriptionAndHideReadMoreButton = (
  description: string,
  setDescription: Dispatch<string>,
  setShowReadMoreButton: Dispatch<boolean>,
) => {
  setDescription(description)
  setShowReadMoreButton(false)
}

const EntityDescription: FC<EntityDescriptionProps> = (props) => {
  const { text } = props

  const { t } = useTranslation('map')

  const [description, setDescription] = useState<string>('')
  const [showReadMoreButton, setShowReadMoreButton] = useState<boolean>(false)

  useEffect(() => {
    if (text.trim().length > ENTITY_DETAIL_DESCRIPTION_LIMIT) {
      setDescription(text.substr(0, ENTITY_DETAIL_DESCRIPTION_LIMIT))
      setShowReadMoreButton(true)

      return
    }

    setDescription(text)
  }, [text])

  return (
    <Paragraph>
      {description}
      {
        showReadMoreButton &&
        <Button
          type="link"
          onClick={() => showFullDescriptionAndHideReadMoreButton(text, setDescription, setShowReadMoreButton)}
        >
          {t('entryDetails.readMore')}
        </Button>
      }
    </Paragraph>
  )
}

export default EntityDescription

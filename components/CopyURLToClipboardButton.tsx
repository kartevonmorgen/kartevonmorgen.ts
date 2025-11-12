import { FC, ReactNode } from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { Button, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'


interface CopyURLToClipboardButtonProps {
  icon?: ReactNode
}

const CopyURLToClipboardButton: FC<CopyURLToClipboardButtonProps> = (props) => {
  const { icon } = props

  const router = useRouter()
  const { asPath: path, locale } = router
  const ogPath = `${process.env.NEXT_PUBLIC_SELF_DOMAIN}/${locale}${path}`.replace('/m/', '/s/')

  const { t } = useTranslation('map')

  return (
    <CopyToClipboard
      text={ogPath}
      onCopy={() => message.success('URL copied to clipboard', 3)}
    >
      <Button
        type="link"
        icon={icon}
        style={{
          color: 'black',
        }}
      >
        {t('copy')}
      </Button>
    </CopyToClipboard>
  )
}


export default CopyURLToClipboardButton

import { FC, ReactNode, useMemo } from 'react'
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
  const { asPath, locale } = router
  const { t } = useTranslation('map')

  // Memoize URL construction to avoid recalculation on every render
  const ogPath = useMemo(() => {
    const [pathname, queryString] = asPath.split('?')
    return `${process.env.NEXT_PUBLIC_SELF_DOMAIN}/${locale}${pathname}${queryString ? `?${queryString}` : ''}`.replace('/m/', '/s/')
  }, [asPath, locale])

  const handleCopy = () => {
    // Use message.success with duration 2 seconds for quicker feedback
    message.success(t('growler.linkCopied') || 'URL copied to clipboard', 2)
  }

  return (
    <CopyToClipboard
      text={ogPath}
      onCopy={handleCopy}
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

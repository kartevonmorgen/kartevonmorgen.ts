import { FC, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { Button, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'


interface CopyURLToClipboardButtonProps {
  icon?: ReactNode
}

const CopyURLToClipboardButton: FC<CopyURLToClipboardButtonProps> = (props) => {

  const { icon } = props

  const router = useRouter()
  const { asPath: path } = router

  return (
    <CopyToClipboard
      text={`${process.env.NEXT_PUBLIC_SELF_DOMAIN}${path}`}
      onCopy={() => message.success('URL copied to clipboard', 3)}
    >
      <Button
        type="link"
        icon={icon}
        style={{
          color: 'black',
        }}
      >
        Copy
      </Button>
    </CopyToClipboard>
  )
}


export default CopyURLToClipboardButton
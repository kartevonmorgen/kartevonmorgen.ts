import { FC } from 'react'
import { useRouter } from 'next/router'
import { Button, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'


const CopyURLToClipboardButton: FC = () => {

  const router = useRouter()
  const { asPath: path } = router

  return (
    <CopyToClipboard
      text={`${process.env.NEXT_PUBLIC_SELF_DOMAIN}${path}`}
      onCopy={() => message.success('URL copied to clipboard', 1)}
    >
      <Button
        type="link"
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
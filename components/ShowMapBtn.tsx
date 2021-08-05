import { Button } from 'antd'
import React from 'react'

export const ShowMapBtn = React.memo((props: any) => {
    return <Button size={'large'} onClick={props.showMapOnBtnClick}>
      Show map...
    </Button>
})
import React from "react"
import { ConfigProvider } from "antd"

const testGreenColor = "#52c41a"
const testRedColor = "#ff0000"

const withTheme = (node: JSX.Element) => (
    <>
      <ConfigProvider>
        {node}
      </ConfigProvider>
    </>
  )

export default withTheme

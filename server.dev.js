const dotenv = require('dotenv')
const cli = require('next/dist/cli/next-dev')

dotenv.config()

process.env.HOSTNAME = process.env.HOSTNAME || 'localhost'
process.env.PORT = process.env.PORT || '3000'
process.env.NEXT_PUBLIC_SELF_DOMAIN = `http://${process.env.HOSTNAME}:${process.env.PORT}`
process.env.NEXT_PUBLIC_SELF_API = `${process.env.NEXT_PUBLIC_SELF_DOMAIN}/api/v0`


cli.nextDev(
  [
    '--port', process.env.PORT,
    '--hostname', process.env.HOSTNAME,
  ],
)
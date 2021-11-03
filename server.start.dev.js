const cli = require('next/dist/cli/next-start')


process.env.HOSTNAME = process.env.HOSTNAME || 'localhost'
process.env.PORT = process.env.PORT || '3001'
process.env.DB_NAME = 'kartevonmorgen.development.sqlite'
process.env.NEXT_PUBLIC_SELF_DOMAIN = `https://dev.kartevonmorgen.org`
process.env.NEXT_PUBLIC_SELF_API = `${process.env.NEXT_PUBLIC_SELF_DOMAIN}/api/v0`


cli.nextStart(
  [
    '--port', process.env.PORT,
    '--hostname', process.env.HOSTNAME,
  ],
)

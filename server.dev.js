const cli = require('next/dist/cli/next-dev')


process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0'
process.env.PORT = process.env.PORT || '3000'


cli.nextDev(
  [
    '--port', process.env.PORT,
    '--hostname', process.env.HOSTNAME,
  ],
)
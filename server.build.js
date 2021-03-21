const cli = require('next/dist/cli/next-build')


process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0'
process.env.PORT = process.env.PORT || '8000'

cli.nextBuild()

const cli = require('next/dist/cli/next-build')
const dotenv = require('dotenv')

dotenv.config()

process.env.HOSTNAME = process.env.HOSTNAME || 'localhost'
process.env.PORT = process.env.PORT || '3000'
process.env.NEXT_PUBLIC_SELF_API = `http://${process.env.HOSTNAME}:${process.env.PORT}/api/v0`
process.env.DB_NAME = 'kartevonmorgen.sqlite'


console.log(process.env)
cli.nextBuild()

const cli = require('next/dist/cli/next-build')
const dotenv = require('dotenv')

dotenv.config()

process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0'
process.env.PORT = process.env.PORT || '3000'
process.env.NEXT_PUBLIC_SELF_API = `http://${process.env.HOSTNAME}:${process.env.PORT}/api/v0`


console.log(process.env)
cli.nextBuild()

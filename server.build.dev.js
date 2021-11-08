const dotenv = require('dotenv')
const cli = require('next/dist/cli/next-build')

dotenv.config()

process.env.NEXT_PUBLIC_BASICS_API = 'https://dev.ofdb.io/v0'
process.env.NEXT_PUBLIC_SELF_DOMAIN = `https://dev.kartevonmorgen.org`
process.env.NEXT_PUBLIC_SELF_API = `${process.env.NEXT_PUBLIC_SELF_DOMAIN}/api/v0`
process.env.DB_NAME = 'kartevonmorgen.development.sqlite'


cli.nextBuild()

const cli = require('next/dist/cli/next-build')
const dotenv = require('dotenv')

dotenv.config()

process.env.NEXT_PUBLIC_SELF_DOMAIN = `https://ssr.kartevonmorgen.org`
process.env.NEXT_PUBLIC_SELF_API = `https://ssr.kartevonmorgen.org/api/v0`
process.env.DB_NAME = 'kartevonmorgen.sqlite'


cli.nextBuild()

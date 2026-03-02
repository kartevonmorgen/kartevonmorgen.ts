const cli = require('next/dist/cli/next-build')
const dotenv = require('dotenv')

dotenv.config()

process.env.NODE_ENV = 'production'
process.env.NEXT_PUBLIC_SELF_DOMAIN = process.env.NEXT_PUBLIC_SELF_DOMAIN || `https://ssr.kartevonmorgen.org`
process.env.NEXT_PUBLIC_SELF_API = process.env.NEXT_PUBLIC_SELF_API || `${process.env.NEXT_PUBLIC_SELF_DOMAIN}/api/v0`
process.env.NEXT_PUBLIC_BASICS_API = process.env.NEXT_PUBLIC_BASICS_API || 'https://api.ofdb.io/v0'
process.env.NEXT_PUBLIC_OFDB_ENTRY_ARCHIVE_URL = process.env.NEXT_PUBLIC_OFDB_ENTRY_ARCHIVE_URL || 'https://api.ofdb.io/v0/entries'
process.env.NEXT_PUBLIC_OFDB_EVENT_ARCHIVE_URL = process.env.NEXT_PUBLIC_OFDB_EVENT_ARCHIVE_URL || 'https://api.ofdb.io/v0/events'
process.env.DB_NAME = process.env.DB_NAME || 'kartevonmorgen.sqlite'


cli.nextBuild()

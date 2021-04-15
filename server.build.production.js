const cli = require('next/dist/cli/next-build')


process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0'
process.env.PORT = process.env.PORT || '3000'

process.env.NEXT_PUBLIC_BASICS_API = 'https://kartevonmorgen.org/api/v0'
process.env.NEXT_PUBLIC_SELF_API = `http://${process.env.HOSTNAME}:${process.env.PORT}/api/v0`
process.env.NEXT_PUBLIC_OFDB_API = 'https://openfairdb.org'
process.env.NEXT_PUBLIC_KVM_REPORT_EMAIL = 'report@kartevonmorgen.org'
process.env.NEXT_PUBLIC_FALANSTER_TOKEN = 'eyJzdWIiOiJtYXBhLWZhbGFuc3RlciIsIm5hbWUiOiJmYWxhbn'

console.log(process.env)
cli.nextBuild()

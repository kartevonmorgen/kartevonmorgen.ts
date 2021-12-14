# Karte von morgen (Map of Tomorrow)

![kartevonmorgen_v1](https://user-images.githubusercontent.com/7106251/126668636-9c859b76-77de-4a05-8300-b38e6c8eb700.jpg)

## Mapping for Good
von morgen supports kindness, sustainability and joint action.
Everything that brings a little happiness to our world.
We believe that living in a de‐stressed, environmental‐friendly and
trust‐worthy society, is already in progress.
We want to support people in finding ways to embrace those values.

The Map von morgen is a website and app, that allows users to share their
favorite places in the world. Places that are forward‐thinking and inspiring.
The goal is to collect projects, companies and events that make a world of
tomorrow, already experienceable today.

Website: [https://kartevonmorgen.org/](https://kartevonmorgen.org/)

## System-Architecture 
This graph shows you, how the whole Map of tomorrow system interacts with each other
![karte von morgen architecture](https://user-images.githubusercontent.com/15019030/125709247-47128e6a-6a23-43cc-839e-33a0f2715def.png)

## Dependencies
- [git](https://www.git-scm.com/)
- [Node.js](https://nodejs.org/) version 14.x
- [yarn](https://yarnpkg.com/getting-started/install) version 1.22.x
- [python3](https://www.python.org/) version >= 3.7.x

### Installing Dependencies
1. node.js: please refer to [nvm](https://github.com/nvm-sh/nvm)
1. yarn: please refer to [the installation guideline](https://classic.yarnpkg.com/en/docs/install/#debian-stable)
1. project:
    1. `git clone https://github.com/kartevonmorgen/kartevonmorgen-v1`
    1. `cd kartevonmorgen-v1`
    1. `yarn install`
1. database:
    1. python3: please refer to [the official website](https://www.python.org/downloads/)
    1. `cd scripts/python`
    1. `python3 -m venv venv`
    1. `. ./venv/bin/activate`
    1. `pip3 install -r requirements.txt`
    1. `python3 tag-frequency-cron.py --dev --fetch-all-on-start --sync-once --log-level debug` (development)
    or `python3 tag-frequency-cron.py --fetch-all-on-start --interval-for-all-tags 300 --interval-for-least-used-tags 60` (production)
    1. **full list of options are available on [Wiki](https://github.com/kartevonmorgen/kartevonmorgen.ts/wiki/How-to-deploy:-tags-synchronizer)**

## Development
The general pattern is:
- server.\*.js files are responsible for building and running "Karte von Morgen"
- .env loads for both the production mode and the development mode
- .env.development loads on the development mode but not the build mode.
  Hence any variable from the environment needed for building MUST be placed in server.build.\*.js
  and for running in the server.start.\*.js
- server.dev.js runs the project on local machine. it compiles pages on runtime and has more verbose error reporting
  but comes with a considerable speed. suitable for development but not user testing or production
 
 ### Development Mode With Hot-Reload
 `yarn run dev`
 
 ### Development Mode With Optimized Bundles
 ```
yarn run build:dev
yarn run start:dev
```

### Production Mode
```
yarn run build:production
yarn run start:production
```

### Process Scalability
After building the project you can run it with [pm2](https://pm2.keymetrics.io/)
```
pm2 start "yarn run start:production" --name kartevonmorgen
```

### Environment Variables
- NEXT_PUBLIC_BASICS_API: is the address of OpenfairDB
- DB_NAME: is the name of the database as the dependency of "Karte von Morgen" front-end
- NEXT_PUBLIC_SELF_API: is the address of the server which "Karte von Morgen" is hosted
- HOSTNAME: is the hostname interface e.g `localhost` or `0.0.0.0`
- PORT: is the port to listen on

## Test Platform
- OS: Ubuntu 20.04.2 LTS
- RAM: 2 GB
- Storage: 20 GB NVMe
- CPU: 1 core 2 GHz

### Backend
KVM uses the [OpenFairDB](https://github.com/kartevonmorgen/openfairdb) as its backend.

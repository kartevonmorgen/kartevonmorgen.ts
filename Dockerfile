FROM node:16-buster

ARG NEXT_PUBLIC_SELF_DOMAIN

ENV PYTHONUNBUFFERED=1
ENV NEXT_PUBLIC_SELF_DOMAIN=$NEXT_PUBLIC_SELF_DOMAIN

RUN apt-get update
RUN apt-get install -y git python3 python3-dev build-essential libc6 libffi-dev python3-pip python3-venv
RUN ln -sf python3 /usr/bin/python

RUN pip3 install --no-cache --upgrade pip setuptools

WORKDIR /frontend
COPY . .

RUN yarn install
RUN yarn run build:production

# Install tag sync -> Another Container
#WORKDIR /frontend/scripts/python
#RUN python3 -m venv venv
#RUN . ./venv/bin/activate
#RUN pip3 install -r requirements.txt

#RUN python3 tag-frequency-cron.py --fetch-all-on-start --sync-once

RUN printf "yarn cache clean\nyarn run start:production\n" > entrypoint.sh

EXPOSE 3000

#CMD ["yarn", "cache", "clean", "&&", "yarn", "run", "start:production"]
CMD ["/bin/sh", "entrypoint.sh"]
FROM node:12

RUN apt-get update && apt-get install -y \
  lsof \
  zip \
  libgtk2.0-0 \
  libnotify-dev \
  libgconf-2-4 \
  libnss3 \
  libxss1 \
  libasound2 \
  chromium=70.0.3538.110-1~deb9u1 \
  xvfb

# Create app directory
WORKDIR /usr/src/app

ADD . /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npx cypress install

EXPOSE 8080
CMD npm run build && CYPRESS_SMOKE=false npx run-p --race start cypress:ci

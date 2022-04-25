FROM ruby:2.6.10

ENV DEBIAN_FRONTEND noninteractive
ENV NODE_VERSION=12.22.12

RUN sed -i '/deb-src/d' /etc/apt/sources.list && \
  apt-get update

RUN apt-get install -y build-essential postgresql-client
RUN gem install bundler
RUN curl -sSL "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" | tar xfJ - -C /usr/local --strip-components=1
RUN npm install --global --unsafe-perm yarn

WORKDIR /tmp
COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock
COPY .env.sample .env

RUN bundle install

WORKDIR /app

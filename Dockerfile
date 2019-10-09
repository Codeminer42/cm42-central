from ruby:2.6.0

env DEBIAN_FRONTEND noninteractive
ENV NODE_VERSION=8.11.3

run sed -i '/deb-src/d' /etc/apt/sources.list && \
  apt-get update

run apt-get install -y build-essential postgresql-client
run gem install bundler
RUN curl -sSL "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" | tar xfJ - -C /usr/local --strip-components=1 && \
  npm install npm -g
run npm install --global yarn

workdir /tmp
copy Gemfile Gemfile
copy Gemfile.lock Gemfile.lock
copy .env.sample .env

run bundle install

run mkdir /app
workdir /app

cmd ["bundle", "exec", "foreman", "start", "-f" , "Procfile.development"]

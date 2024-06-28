FROM ruby:2.7.8

ENV DEBIAN_FRONTEND noninteractive
ENV NODE_VERSION=16.20.0

RUN sed -i '/deb-src/d' /etc/apt/sources.list && \
  apt-get update

RUN apt-get install -y build-essential postgresql-client
RUN gem install bundler
RUN curl -sSL "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" | tar xfJ - -C /usr/local --strip-components=1
RUN npm install --global --unsafe-perm yarn

ENV CHROME_VERSION 106.0.5249.61
RUN wget http://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_${CHROME_VERSION}-1_amd64.deb \
  && dpkg -i google-chrome-stable_${CHROME_VERSION}-1_amd64.deb || true \
  && apt-get -f install -y \
  && rm -v google-chrome-stable_${CHROME_VERSION}-1_amd64.deb \
  && wget https://chromedriver.storage.googleapis.com/${CHROME_VERSION}/chromedriver_linux64.zip \
  && unzip chromedriver_linux64.zip -d /usr/local/bin \
  && rm chromedriver_linux64.zip

WORKDIR /tmp
COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock
COPY yarn.lock yarn.lock
COPY .env.sample .env

ADD pusher-fake-entrypoint.sh /tmp/pusher-fake-entrypoint.sh

ENV PUSHER_APP_ID=1234 \
    PUSHER_APP_KEY=123456 \
    PUSHER_APP_SECRET=34214341 \
    PUSHER_PORT=8888 \
    PUSHER_WS_PORT=45449

EXPOSE $PUSHER_WS_PORT $PUSHER_PORT

CMD ["/tmp/pusher-fake-entrypoint.sh"]

RUN bundle install

WORKDIR /app

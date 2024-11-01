FROM ruby:2.7.8

ARG USER_ID=1000
ARG GROUP_ID=1000

ENV DEBIAN_FRONTEND noninteractive

COPY Gemfile.lock .

ENV NODE_VERSION 20.17.0
ENV YARN_VERSION 1.22.19

ENV BUNDLE_PATH /bundle
ENV BUNDLE_BIN /bundle/bin
ENV GEM_HOME /bundle
ENV PATH "${BUNDLE_BIN}:${PATH}"

RUN sed -i '/deb-src/d' /etc/apt/sources.list \
  && apt-get update \
  && apt-get install -y \
    build-essential \
    postgresql-client \
    xvfb \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libcurl3-gnutls \
    libdbus-1-3 \
    libdrm2 \
    libexpat1 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libu2f-udev \
    libvulkan1 \
    libx11-6 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
  && gem install bundler -v $(tail -n 1 Gemfile.lock) \
  && groupadd --gid ${GROUP_ID} app \
  && useradd --system --create-home --no-log-init --uid ${USER_ID} --gid ${GROUP_ID} --groups sudo app \
  && mkdir /var/app && chown -R app:app /var/app \
  && echo "app ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers \
  && chown -R app:app $BUNDLE_PATH

# Install chrome and chromedriver for integration tests
ENV CHROME_VERSION 125.0.6422.78
RUN wget https://storage.googleapis.com/chrome-for-testing-public/${CHROME_VERSION}/linux64/chrome-linux64.zip \
  && unzip chrome-linux64.zip -d /opt/ \
  && chmod +x /opt/chrome-linux64/chrome \
  && ln -s /opt/chrome-linux64/chrome /usr/local/bin/chrome \
  && rm chrome-linux64.zip \
  && wget https://storage.googleapis.com/chrome-for-testing-public/${CHROME_VERSION}/linux64/chromedriver-linux64.zip \
  && unzip chromedriver-linux64.zip -d /opt/ \
  && chmod +x /opt/chromedriver-linux64/chromedriver \
  && ln -s /opt/chromedriver-linux64/chromedriver /usr/local/bin/chromedriver \
  && rm chromedriver-linux64.zip

USER app

# Install node for app user
ENV NVM_DIR /home/app/.nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash \
  && . ~/.nvm/nvm.sh \
  && nvm install ${NODE_VERSION} \
  && nvm alias default ${NODE_VERSION} \
  && nvm use default \
  && npm install -g yarn@${YARN_VERSION}
ENV NODE_PATH ${NVM_DIR}/versions/node/v${NODE_VERSION}/lib/node_modules
ENV PATH ${NVM_DIR}/versions/node/v${NODE_VERSION}/bin:${PATH}

# Set up Pusher Fake
ENV PUSHER_PORT 8888
ENV PUSHER_WS_PORT 45449

ADD pusher-fake-entrypoint.sh /tmp/pusher-fake-entrypoint.sh

EXPOSE $PUSHER_WS_PORT $PUSHER_PORT

CMD ["/tmp/pusher-fake-entrypoint.sh"]

WORKDIR /var/app

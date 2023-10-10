FROM ruby:2.7.8

ARG USER_ID=1000
ARG GROUP_ID=1000

ENV DEBIAN_FRONTEND noninteractive

ENV BUNDLER_VERSION 2.4.13
ENV NODE_VERSION 16.20.0
ENV YARN_VERSION 1.22.19

ENV BUNDLE_PATH /bundle
ENV BUNDLE_BIN /bundle/bin
ENV GEM_HOME /bundle
ENV PATH "${BUNDLE_BIN}:${PATH}"

RUN sed -i '/deb-src/d' /etc/apt/sources.list \
  && apt-get update \
  && apt-get install -y build-essential postgresql-client \
  && gem install bundler -v ${BUNDLER_VERSION} \
  && groupadd --gid ${GROUP_ID} app \
  && useradd --system --create-home --no-log-init --uid ${USER_ID} --gid ${GROUP_ID} --groups sudo app \
  && mkdir /var/app && chown -R app:app /var/app \
  && echo "app ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers \
  && chown -R app:app $BUNDLE_PATH

# Install chrome and chromedriver for integration tests
ENV CHROME_VERSION 106.0.5249.61
RUN wget http://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_${CHROME_VERSION}-1_amd64.deb \
  && dpkg -i google-chrome-stable_${CHROME_VERSION}-1_amd64.deb || true \
  && apt-get -f install -y \
  && rm -v google-chrome-stable_${CHROME_VERSION}-1_amd64.deb \
  && wget https://chromedriver.storage.googleapis.com/${CHROME_VERSION}/chromedriver_linux64.zip \
  && unzip chromedriver_linux64.zip -d /usr/local/bin \
  && rm chromedriver_linux64.zip

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

WORKDIR /var/app

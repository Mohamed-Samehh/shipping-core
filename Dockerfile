# Build image for the @helix/shipping-core library and its test harness.
# Uses a pinned Node 20 LTS base for reproducible builds.

FROM node:20.14.0-bookworm-slim

ENV NODE_ENV=development \
    CI=true \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_AUDIT=false

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
        ca-certificates \
        git \
        tini \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies first to maximise layer caching on source-only edits.
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci --no-audit --no-fund --loglevel=warn

# Copy the rest of the project (source, tests, config, docs).
COPY . /app

RUN npx tsc --noEmit

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["npm", "test", "--", "--colors=false"]

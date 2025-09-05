# syntax = docker/dockerfile:1

# This Dockerfile is designed for production, not development. Use with Kamal or build'n'run by hand:
# docker build -t spree-rails8-staging .
# docker run -d -p 80:3000 -e RAILS_MASTER_KEY=<value from config/master.key> spree-rails8-staging

# Make sure RUBY_VERSION matches the Ruby version in .ruby-version
ARG RUBY_VERSION=3.4.1
FROM docker.io/library/ruby:$RUBY_VERSION-slim AS base

# Rails app lives here
WORKDIR /rails

# Install base packages
ARG TARGETARCH
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl libjemalloc2 libvips && \
    case "$TARGETARCH" in \
      "amd64") ARCH_SUFFIX="" ;; \
      "arm64") ARCH_SUFFIX="" ;; \
      *) echo "Unsupported architecture: $TARGETARCH" && exit 1 ;; \
    esac && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install --no-install-recommends -y nodejs && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Set build environment - RAILS_ENV will be configured at runtime
ENV BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development"

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build gems and node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential git libpq-dev libyaml-dev pkg-config && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Install application gems
COPY Gemfile Gemfile.lock ./
COPY vendor/gems ./vendor/gems
RUN bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    bundle exec bootsnap precompile --gemfile

# Install node modules - ИСПРАВЛЯЕМ: устанавливаем ВСЕ зависимости в build stage
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force  # Убираем --only=production

# Copy application code
COPY . .

# Precompile bootsnap code for faster boot times
RUN bundle exec bootsnap precompile app/ lib/

# Build Vite assets for production/staging - используем ARG для гибкости
ARG RAILS_ENV=staging
# Force rebuild - change this comment to break cache
# Build timestamp: 2025-09-02 19:20:10

# Build Vite assets for staging
RUN echo "🔨 Starting Vite build for ${RAILS_ENV}..." && \
    echo "Node version: $(node -v)" && \
    echo "Available memory:" && free -h && \
    SECRET_KEY_BASE=dummy_for_build \
    RAILS_ENV=${RAILS_ENV} bin/vite build || \
    (echo "❌ Vite build failed" && exit 1)

# Alternative if above fails - try without timeout
# RUN npx vite build --logLevel info

# Assets will be built by Kamal hooks, not in Docker
# RUN echo "🔨 Starting Vite build..." && \
#     bin/vite build && \
#     echo "✅ Vite build completed" && \
#     ls -la public/vite/

# Создаем пустую БД для Vite build
RUN touch db/staging.sqlite3 && \
    SECRET_KEY_BASE=dummy_for_build \
    RAILS_ENV=staging bin/vite build

# Final stage for app image
FROM base

# Copy built artifacts: gems, application, and node_modules
COPY --from=build "${BUNDLE_PATH}" "${BUNDLE_PATH}"
COPY --from=build /rails /rails

# Run and own only the runtime files as a non-root user for security
RUN groupadd --system --gid 1000 rails && \
    useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash && \
    mkdir -p /rails/storage/databases /rails/storage/active_storage /rails/storage/tmp && \
    chown -R rails:rails storage tmp

# Define volume for persistent data
VOLUME ["/rails/storage"]

USER 1000:1000

# Entrypoint prepares the database.
ENTRYPOINT ["/rails/bin/docker-entrypoint"]


# Start the server by default, this can be overwritten at runtime
EXPOSE 80
CMD ["./bin/thrust", "./bin/rails", "server"]
# Force rebuild Mon Sep  1 20:04:21 MSK 2025

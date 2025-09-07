# Staging Server Deployment Plan

## 🎯 Overview
Deploy Spree Rails 8 application to VPN server (CAX11 - 2 vCPU, 4GB RAM, 40GB disk) using SQLite for staging environment.

## 📋 Prerequisites

### Server Requirements ✅
- **Server**: CAX11 (46.62.141.255 / 2a01:4f9:c011:8f82::/64)
- **Resources**: 2 vCPU Arm64, 4 GB RAM, 40 GB disk
- **OS**: Ubuntu/Debian (recommended)
- **Docker**: Required for Kamal deployment

### Local Requirements
- Docker installed and running
- SSH access to staging server
- Domain name pointing to server IP (optional but recommended)

## 🔧 Phase 1: Server Preparation

### Step 1.1: Server Setup
```bash
# Connect to server
ssh root@46.62.141.255

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Create app user (optional but recommended)
adduser deploy
usermod -aG docker deploy
usermod -aG sudo deploy

# Setup SSH key for deploy user
mkdir -p /home/deploy/.ssh
cp /root/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

### Step 1.2: Firewall Configuration
```bash
# Install and configure UFW
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable

# Check status
ufw status
```

### Step 1.3: Domain Setup (Optional)
```bash
# If using domain, point A record to: 46.62.141.255
# Example: staging.yourdomain.com -> 46.62.141.255
```

## 🗄️ Phase 2: Database Configuration

### Step 2.1: Update Database Configuration
Create staging-specific database config:

```yaml
# config/database.yml - Update staging section
staging:
  primary:
    adapter: sqlite3
    database: storage/spree_rails8_modern_fresh_staging.sqlite3
    pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
    timeout: 5000
  solid_queue:
    adapter: sqlite3
    database: storage/spree_rails8_modern_fresh_solid_queue_staging.sqlite3
  solid_cable:
    adapter: sqlite3
    database: storage/spree_rails8_modern_fresh_solid_cable_staging.sqlite3
  solid_cache:
    adapter: sqlite3
    database: storage/spree_rails8_modern_fresh_solid_cache_staging.sqlite3
```

### Step 2.2: Update Gemfile for SQLite
Ensure SQLite is available in staging:

```ruby
# Gemfile - Update database gems
gem "pg", "~> 1.1"
gem "sqlite3", ">= 2.1"  # Ensure version compatibility
```

## 🚀 Phase 3: Kamal Deployment Configuration

### Step 3.1: Create Staging Deploy Config
```yaml
# config/deploy.staging.yml
service: spree-rails8-staging

image: your-dockerhub-username/spree-rails8-staging

servers:
  web:
    - 46.62.141.255

# SSL with Let's Encrypt (if using domain)
proxy:
  ssl: true
  host: staging.yourdomain.com  # Replace with your domain
  # OR for IP-only access:
  # ssl: false
  # host: 46.62.141.255

registry:
  username: your-dockerhub-username
  password:
    - KAMAL_REGISTRY_PASSWORD

env:
  secret:
    - RAILS_MASTER_KEY
  clear:
    RAILS_ENV: staging
    SOLID_QUEUE_IN_PUMA: true
    WEB_CONCURRENCY: 1
    RAILS_LOG_LEVEL: info
    RAILS_SERVE_STATIC_FILES: true

# SQLite storage volume
volumes:
  - "spree_staging_storage:/rails/storage"

asset_path: /rails/public/assets

builder:
  arch: arm64  # Match server architecture

# SSH configuration
ssh:
  user: deploy  # Use deploy user instead of root
```

### Step 3.2: Create Secrets File
```bash
# Create .kamal/secrets.staging
mkdir -p .kamal
touch .kamal/secrets.staging

# Add to .kamal/secrets.staging:
KAMAL_REGISTRY_PASSWORD=your_dockerhub_password
RAILS_MASTER_KEY=your_rails_master_key_from_config/master.key
```

### Step 3.3: Update Dockerfile for Staging
Ensure Dockerfile supports SQLite:

```dockerfile
# Dockerfile - Add SQLite support
FROM ruby:3.4.1-slim

# Install system dependencies including SQLite
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    curl \
    git \
    libpq-dev \
    libsqlite3-dev \
    libvips \
    node-gyp \
    pkg-config \
    python-is-python3 && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# ... rest of Dockerfile
```

## 🔄 Phase 4: Environment Configuration

### Step 4.1: Create Staging Environment File
```ruby
# config/environments/staging.rb
require_relative "production"

Rails.application.configure do
  # Staging-specific overrides
  config.log_level = :info
  config.consider_all_requests_local = false
  config.action_controller.perform_caching = true
  
  # Allow debugging in staging
  config.debug_exception_response_format = :api
  
  # Less strict asset compilation
  config.assets.compile = true
  config.assets.digest = true
  
  # SQLite optimizations
  config.active_record.sqlite3_adapter_strict_strings_by_default = false
end
```

### Step 4.2: Update Routes for Staging
```ruby
# config/routes.rb - Add staging-specific routes if needed
Rails.application.routes.draw do
  # Existing routes...
  
  if Rails.env.staging?
    # Add staging-specific debugging routes
    mount Spree::Core::Engine, at: '/'
  end
end
```

## 📦 Phase 5: Deployment Process

### Step 5.1: Initial Deployment
```bash
# Build and deploy to staging
bin/kamal setup -d staging

# Or step by step:
bin/kamal server bootstrap -d staging
bin/kamal deploy -d staging
```

### Step 5.2: Database Setup
```bash
# Run database migrations
bin/kamal app exec -d staging "bin/rails db:create db:migrate"

# Load sample data (optional)
bin/kamal app exec -d staging "bin/rails db:seed"
bin/kamal app exec -d staging "bin/rails spree_sample:load"
```

### Step 5.3: Create Admin User
```bash
# Create admin user
bin/kamal app exec -d staging -i "bin/rails console"

# In Rails console:
admin = Spree.admin_user_class.create!(
  email: 'admin@staging.com',
  password: 'staging123',
  password_confirmation: 'staging123'
)
```

## 🔍 Phase 6: Verification & Testing

### Step 6.1: Health Checks
```bash
# Check application status
bin/kamal app logs -d staging

# Check containers
bin/kamal app details -d staging

# Test HTTP response
curl -I http://46.62.141.255
# OR with domain:
curl -I https://staging.yourdomain.com
```

### Step 6.2: Application Testing
1. **Storefront**: Visit `http://46.62.141.255` or `https://staging.yourdomain.com`
2. **Admin Panel**: Visit `/admin` and login with created admin user
3. **Test Features**:
   - Product browsing
   - Cart functionality
   - Admin product management
   - Order processing

## 🛠️ Phase 7: Maintenance & Updates

### Step 7.1: Deployment Commands
```bash
# Deploy updates
bin/kamal deploy -d staging

# View logs
bin/kamal app logs -d staging -f

# Access console
bin/kamal app exec -d staging -i "bin/rails console"

# Database console
bin/kamal app exec -d staging -i "bin/rails dbconsole"

# Restart application
bin/kamal app boot -d staging
```

### Step 7.2: Backup Strategy
```bash
# Backup SQLite databases
bin/kamal app exec -d staging "tar -czf /tmp/staging_backup_$(date +%Y%m%d).tar.gz storage/*.sqlite3"

# Copy backup to local
bin/kamal app exec -d staging "cat /tmp/staging_backup_*.tar.gz" > staging_backup.tar.gz
```

### Step 7.3: Monitoring
```bash
# Check disk usage
bin/kamal app exec -d staging "df -h"

# Check memory usage
bin/kamal app exec -d staging "free -h"

# Check application performance
bin/kamal app exec -d staging "ps aux | grep puma"
```

## 🚨 Troubleshooting

### Common Issues

1. **Build fails on ARM64**:
   ```bash
   # Use remote builder or build locally
   bin/kamal build deliver -d staging
   ```

2. **SQLite permission issues**:
   ```bash
   bin/kamal app exec -d staging "chmod 664 storage/*.sqlite3"
   bin/kamal app exec -d staging "chown app:app storage/*.sqlite3"
   ```

3. **SSL certificate issues**:
   ```bash
   # Check Traefik logs
   bin/kamal traefik logs -d staging
   ```

4. **Memory issues**:
   ```bash
   # Reduce Puma workers
   # In deploy.staging.yml:
   env:
     clear:
       WEB_CONCURRENCY: 1
   ```

## 📝 Security Checklist

- [ ] SSH key authentication only
- [ ] Firewall configured (UFW)
- [ ] Non-root user for deployment
- [ ] SSL certificate (if using domain)
- [ ] Strong admin passwords
- [ ] Regular security updates
- [ ] Backup strategy implemented

## 🎉 Success Criteria

- [ ] Application accessible via HTTP/HTTPS
- [ ] Admin panel functional
- [ ] Storefront working
- [ ] Database operations successful
- [ ] Logs accessible
- [ ] Deployment pipeline working
- [ ] SSL certificate valid (if applicable)

## 📞 Support Commands

```bash
# Quick status check
bin/kamal app details -d staging

# Emergency restart
bin/kamal app boot -d staging

# View all containers
bin/kamal server exec -d staging "docker ps"

# Free up space
bin/kamal server exec -d staging "docker system prune -f"
```

---

**Estimated Deployment Time**: 2-3 hours for initial setup
**Estimated Monthly Cost**: €3.29 (server) + minimal Docker Hub usage
**Recommended Maintenance**: Weekly updates, monthly backups

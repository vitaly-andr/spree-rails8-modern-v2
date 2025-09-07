# 🚀 Kamal CLI Commands Reference

## 📋 Overview

This document contains all essential Kamal commands for managing the Spree Rails 8 staging deployment.

## 🔧 Initial Deployment

### First Deploy
```bash
# Deploy with SSH fingerprint bypass (first time)
SSH_OPTIONS="-o StrictHostKeyChecking=no" kamal deploy

# Regular deploy (after SSH is configured)
kamal deploy
```

### Post-Deploy Setup
```bash
# 1. Create symlinks to Spree gem JavaScript files
kamal app exec "rails spree:setup_symlinks"

# 2. Compile assets (after symlinks are created)
kamal app exec "rails assets:precompile"

# 3. Setup database
kamal app exec "rails db:create db:migrate"

# 4. Load sample data (optional)
kamal app exec "rails db:seed"

# 5. Verify application is running
kamal app exec "rails runner 'puts Rails.env'"
```

## 🔄 Application Management

### Restart & Updates
```bash
# Restart application containers
kamal app restart

# Deploy new version (rebuild + restart)
kamal deploy

# Deploy without building (use existing image)
kamal app restart
```

### Logs & Monitoring
```bash
# View application logs (follow mode)
kamal app logs -f

# View application logs (last 100 lines)
kamal app logs --lines 100

# View all service logs
kamal logs

# Check deployment status
kamal details

# Check container health
kamal app details
```

## 🐚 Interactive Commands

### Console Access
```bash
# Rails console
kamal app exec "rails console"

# Bash shell in container
kamal app exec bash

# Run custom Rails commands
kamal app exec "rails runner 'puts User.count'"

# Database console
kamal app exec "rails dbconsole"
```

## 🗄️ Database Operations

### Database Management
```bash
# Run migrations
kamal app exec "rails db:migrate"

# Rollback migration
kamal app exec "rails db:rollback"

# Reset database (DANGEROUS!)
kamal app exec "rails db:drop db:create db:migrate db:seed"

# Database backup (SQLite)
kamal app exec "cp /rails/db/staging.sqlite3 /rails/storage/backup_$(date +%Y%m%d_%H%M%S).sqlite3"
```

## 🎨 Asset Management

### Assets & Precompilation
```bash
# Precompile assets
kamal app exec "rails assets:precompile"

# Clean assets
kamal app exec "rails assets:clean"

# Setup Spree symlinks (required before asset compilation)
kamal app exec "rails spree:setup_symlinks"

# Verify assets
kamal app exec "ls -la /rails/public/assets"
```

## 🔧 Container Management

### Start/Stop Services
```bash
# Stop application
kamal app stop

# Start application
kamal app start

# Restart application
kamal app restart

# Remove all containers and images (DANGEROUS!)
kamal remove
```

### Container Information
```bash
# Show running containers
kamal app details

# Show all Kamal services
kamal details

# Show container resource usage
kamal app exec "ps aux"

# Show disk usage
kamal app exec "df -h"
```

## 🔍 Debugging & Troubleshooting

### Debug Commands
```bash
# Check Rails environment
kamal app exec "rails runner 'puts Rails.env'"

# Check database connection
kamal app exec "rails runner 'puts ActiveRecord::Base.connection.adapter_name'"

# Check Spree installation
kamal app exec "rails runner 'puts Spree::Core::VERSION'"

# Check symlinks
kamal app exec "ls -la /rails/app/frontend/spree/"

# Test application health
curl -I http://staging.andrianoff.online/up
```

### Log Analysis
```bash
# Application logs with grep
kamal app logs | grep ERROR

# System logs
kamal app exec "journalctl -u docker --no-pager -n 50"

# Rails logs
kamal app exec "tail -f /rails/log/staging.log"
```

## 🚨 Emergency Commands

### Quick Fixes
```bash
# Force restart everything
kamal app stop && kamal app start

# Rebuild and redeploy
kamal deploy --skip-push=false

# Emergency rollback (if you have previous image)
# Edit deploy.yml to use previous image tag, then:
kamal app restart

# Emergency shell access
ssh deploy@95.217.223.50
sudo docker ps
sudo docker exec -it <container_id> bash
```

### Health Checks
```bash
# Manual health check
kamal app exec "curl -f http://localhost:3000/up || exit 1"

# Check if Rails is responding
kamal app exec "rails runner 'puts \"Rails OK: #{Time.current}\"'"

# Check database
kamal app exec "rails runner 'puts \"DB OK: #{ActiveRecord::Base.connection.execute(\"SELECT 1\").first}\"'"
```

## 📝 Configuration Management

### Environment Variables
```bash
# Check environment variables
kamal app exec env

# Check Rails master key
kamal app exec "rails runner 'puts Rails.application.credentials.config'"

# Update secrets (edit .kamal/secrets then)
kamal app restart
```

### Volume Management
```bash
# Check mounted volumes
kamal app exec "df -h"

# List storage contents
kamal app exec "ls -la /rails/storage/"

# Check database files
kamal app exec "ls -la /rails/db/"
```

## 🔄 Deployment Workflow

### Standard Update Process
```bash
# 1. Make code changes locally
# 2. Commit changes
git add .
git commit -m "feat: your changes"

# 3. Deploy
kamal deploy

# 4. Run any necessary migrations
kamal app exec "rails db:migrate"

# 5. Verify deployment
kamal app logs -f
curl -I http://staging.andrianoff.online/up
```

### Rollback Process
```bash
# 1. Check previous images
docker images | grep spree-rails8-staging

# 2. Update deploy.yml with previous image tag
# 3. Restart with previous version
kamal app restart

# 4. Or redeploy from previous git commit
git checkout <previous_commit>
kamal deploy
git checkout main
```

## 📊 Monitoring Commands

### Performance Monitoring
```bash
# Container resource usage
kamal app exec "top -bn1"

# Memory usage
kamal app exec "free -h"

# Disk usage
kamal app exec "du -sh /rails/*"

# Network connections
kamal app exec "netstat -tulpn"
```

### Application Metrics
```bash
# Rails stats
kamal app exec "rails stats"

# Database size (SQLite)
kamal app exec "ls -lh /rails/db/*.sqlite3"

# Log file sizes
kamal app exec "ls -lh /rails/log/"
```

---

## 🚨 Important Notes

- Always use `SSH_OPTIONS="-o StrictHostKeyChecking=no"` if you encounter SSH fingerprint issues
- Run `rails spree:setup_symlinks` before `rails assets:precompile`
- Database files are persisted in `/home/deploy/app-db/` on the server
- Application logs are in `/home/deploy/app-log/` on the server
- Storage files are in `/home/deploy/app-storage/` on the server

## 🔗 Quick Reference

| Task | Command |
|------|---------|
| Deploy | `kamal deploy` |
| Restart | `kamal app restart` |
| Logs | `kamal app logs -f` |
| Console | `kamal app exec "rails console"` |
| Shell | `kamal app exec bash` |
| Status | `kamal details` |
| Migrate | `kamal app exec "rails db:migrate"` |
| Assets | `kamal app exec "rails assets:precompile"` |

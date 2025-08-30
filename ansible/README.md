# Ansible Staging Deployment

This Ansible playbook deploys a Spree Rails 8 application to a staging server.

## Server Configuration

- **Server**: Hetzner CAX21 (4 vCPU, 8GB RAM, 80GB SSD)
- **IP**: 95.217.223.50
- **Location**: Helsinki, Finland
- **OS**: Ubuntu 24.04 LTS
- **Firewall**: External Hetzner firewall (ports 22, 80, 443, 3000 open)

## Prerequisites

1. **SSH Key**: Ensure your SSH key is added to the server
2. **Domain**: Point `staging.andrianoff.online` to `95.217.223.50`
3. **Hetzner Firewall**: Ensure ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 3000 (App) are open

## Quick Start

1. **Setup**:
   ```bash
   make setup
   ```

2. **Deploy**:
   ```bash
   make deploy
   ```

3. **Verify**:
   ```bash
   make verify
   ```

## Configuration

- **Database**: SQLite3 (for staging simplicity)
- **Web Server**: Nginx + Let's Encrypt SSL
- **App Server**: Docker + Docker Compose
- **Monitoring**: Basic system monitoring and log rotation
- **Backups**: Daily database backups with 7-day retention

## Ports Used

- **22**: SSH
- **80**: HTTP (redirects to HTTPS)
- **443**: HTTPS (Nginx + SSL)
- **3000**: Rails application (internal)

## Security Features

- **SSH**: Key-based authentication only, no root login
- **Fail2ban**: Protection against brute force attacks
- **Unattended upgrades**: Automatic security updates
- **Log monitoring**: Comprehensive logging and monitoring

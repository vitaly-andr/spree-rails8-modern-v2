#!/bin/bash

echo "🚀 Spree Rails 8 Staging Server Quick Start"
echo "=============================================="
echo

# Check if Ansible is installed
if ! command -v ansible &> /dev/null; then
    echo "❌ Ansible not found. Installing..."
    pip3 install ansible
fi

# Check if inventory file exists
if [ ! -f "inventory/staging_ansible.yml" ]; then
    echo "❌ Inventory file not found. Please configure inventory/staging_ansible.yml first."
    exit 1
fi

# Check if secrets file exists
if [ ! -f "vault/secrets.yml" ]; then
    echo "🔐 Creating encrypted secrets file..."
    ansible-vault create vault/secrets.yml
    echo "✅ Secrets file created. Please edit it with your credentials."
    exit 0
fi

echo "✅ Prerequisites check passed!"
echo

echo "📋 Available commands:"
echo "  make setup    - Full server setup (first time)"
echo "  make deploy   - Deploy application updates"
echo "  make verify   - Verify deployment"
echo "  make monitor  - Show server status"
echo "  make backup   - Run manual backup"
echo "  make clean    - Clean up resources"
echo

echo "🎯 To start deployment, run:"
echo "  make setup"
echo

echo "📚 For more information, see README.md"

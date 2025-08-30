.PHONY: help setup deploy verify backup monitor clean

help:
	@echo "Available commands:"
	@echo "  setup    - Initial server setup"
	@echo "  deploy   - Deploy application"
	@echo "  verify   - Verify deployment"
	@echo "  backup   - Run backup manually"
	@echo "  monitor  - Show monitoring info"
	@echo "  clean    - Clean up resources"

setup:
	ansible-playbook -i inventory/staging_ansible.yml playbook_ansible.yml

deploy:
	ansible-playbook -i inventory/staging_ansible.yml playbook_ansible.yml --tags application

verify:
	ansible-playbook -i inventory/staging_ansible.yml playbook_ansible.yml --tags verify

backup:
	ansible staging -i inventory/staging_ansible.yml -m shell -a "/home/deploy/backup.sh"

monitor:
	ansible staging -i inventory/staging_ansible.yml -m shell -a "/home/deploy/monitor.sh"

clean:
	ansible staging -i inventory/staging_ansible.yml -m shell -a "docker system prune -f"

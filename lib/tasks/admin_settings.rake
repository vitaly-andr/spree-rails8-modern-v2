# lib/tasks/admin_settings.rake
namespace :admin_settings do
  desc "Show current admin configuration"
  task show: :environment do
    puts "🔧 Current admin configuration..."

    store = Spree::Store.default

    puts "\n👤 Admin Users:"
    Spree.admin_user_class.includes(:spree_roles).each do |admin|
      roles = admin.spree_roles.pluck(:name).join(", ")
      puts "- #{admin.email} (#{roles})"
    end

    puts "\n✅ Configuration overview complete!"
    puts "💡 For full export with theme content: rails theme:export"
  end
end

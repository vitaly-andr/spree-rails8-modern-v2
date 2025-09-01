# Spree Setup Seeds
# This file initializes basic Spree data: store, theme, and pages

puts "🛒 Setting up Spree Commerce for #{Rails.env}..."

# Determine URL based on environment
store_url = case Rails.env
when 'development'
  'localhost:5100'
when 'staging'
  'staging.andrianoff.online'
when 'production'
  'production.andrianoff.online'
else
  'localhost:3000'
end

# Create default store if it doesn't exist
store = Spree::Store.first_or_create!(
  name: "Bau-portal.online Store",
  url: store_url,
  mail_from_address: "noreply@bau-portal.online",
  default_currency: "USD",
  code: "bauportal",
  default: true
)

puts "✅ Store created: #{store.name} (#{store.url})"

# Create default theme if it doesn't exist
theme = Spree::Theme.where(store: store).first_or_create!(
  name: "Default Theme",
  type: "Spree::Themes::Default",
  default: true,
  ready: true
)

puts "✅ Theme created: #{theme.name}"

# Create default pages for the theme
if theme.pages.empty?
  # Create homepage
  homepage = theme.pages.create!(
    type: "Spree::Pages::Homepage",
    name: "Homepage",
    slug: "homepage",
    meta_title: "Welcome to Bau-portal.online",
    meta_description: "Bau-portal.online - Construction portal and marketplace"
  )

  puts "✅ Homepage created: #{homepage.name}"
end

# Create our admin user if there's only default Spree admin (count == 1)
if Spree.admin_user_class.count == 1
  # Remove default Spree admin user
  Spree.admin_user_class.first.destroy

  # Create our admin user
  admin_user = Spree.admin_user_class.create!(
    email: "admin@bau-portal.online",
    password: "password123",
    password_confirmation: "password123"
  )

  puts "✅ Admin user created: #{admin_user.email}"
  puts "   Password: password123"
end

puts "🎉 Bau-portal.online Spree setup complete for #{Rails.env}!"
puts ""
puts "Next steps:"
puts "1. Visit http://#{store_url}/admin to access admin panel"
puts "2. Login with: admin@bau-portal.online / password123"
puts "3. Configure your store settings"

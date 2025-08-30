# Spree Setup Seeds
# This file initializes basic Spree data: store, theme, and pages

puts "🛒 Setting up Spree Commerce..."

# Create default store if it doesn't exist
store = Spree::Store.first_or_create!(
  name: "Bau-portal.online Store",
  url: "localhost:5100",
  mail_from_address: "noreply@bau-portal.online",
  default_currency: "USD",
  code: "bauportal",
  default: true
)

puts "✅ Store created: #{store.name}"

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

# Create default admin user if none exists
if Spree.admin_user_class.count == 0
  admin_user = Spree.admin_user_class.create!(
    email: "admin@bau-portal.online",
    password: "password123",
    password_confirmation: "password123"
  )

  puts "✅ Admin user created: #{admin_user.email}"
  puts "   Password: password123"
end

puts "🎉 Bau-portal.online Spree setup complete!"
puts ""
puts "Next steps:"
puts "1. Visit http://localhost:5100/admin to access admin panel"
puts "2. Login with: admin@bau-portal.online / password123"
puts "3. Configure your store settings"

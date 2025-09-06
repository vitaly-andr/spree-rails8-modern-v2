# Theme Content Seeds
# Generated on 2025-09-06 02:43:32 UTC

puts "🎨 Loading theme content..."

store = Spree::Store.find_by(code: 'bauportal') || Spree::Store.default

# Обновляем только настройки локализации и валют
store.update!(
  default_locale: "ru",
  supported_locales: "ru,en",
  default_currency: "RUB",
  supported_currencies: "RUB,USD"
)

theme = store.themes.find_by(type: 'Spree::Themes::Default') || store.default_theme


# Page: Cart
page = theme.pages.find_or_create_by!(slug: nil) do |p|
  p.type = "Spree::Pages::Cart"
  p.name = "Cart"
  p.meta_title = nil
  p.meta_description = nil
end


# Page: Post
page = theme.pages.find_or_create_by!(slug: nil) do |p|
  p.type = "Spree::Pages::Post"
  p.name = "Post"
  p.meta_title = nil
  p.meta_description = nil
end


# Section: Post Details
section = page.sections.find_or_create_by!(name: "Post Details") do |s|
  s.type = "Spree::PageSections::PostDetails"
end


# Page: TaxonList
page = theme.pages.find_or_create_by!(slug: nil) do |p|
  p.type = "Spree::Pages::TaxonList"
  p.name = "TaxonList"
  p.meta_title = nil
  p.meta_description = nil
end


# Section: Taxon Grid
section = page.sections.find_or_create_by!(name: "Taxon Grid") do |s|
  s.type = "Spree::PageSections::TaxonGrid"
end


# Page: ProductDetails
page = theme.pages.find_or_create_by!(slug: nil) do |p|
  p.type = "Spree::Pages::ProductDetails"
  p.name = "ProductDetails"
  p.meta_title = nil
  p.meta_description = nil
end


# Section: Product Details
section = page.sections.find_or_create_by!(name: "Product Details") do |s|
  s.type = "Spree::PageSections::ProductDetails"
end


# Section: Related Products
section = page.sections.find_or_create_by!(name: "Related Products") do |s|
  s.type = "Spree::PageSections::RelatedProducts"
end


# Page: ShopAll
page = theme.pages.find_or_create_by!(slug: nil) do |p|
  p.type = "Spree::Pages::ShopAll"
  p.name = "ShopAll"
  p.meta_title = nil
  p.meta_description = nil
end


# Section: Page Title
section = page.sections.find_or_create_by!(name: "Page Title") do |s|
  s.type = "Spree::PageSections::PageTitle"
end


# Section: Product Grid
section = page.sections.find_or_create_by!(name: "Product Grid") do |s|
  s.type = "Spree::PageSections::ProductGrid"
end


# Page: Taxon
page = theme.pages.find_or_create_by!(slug: nil) do |p|
  p.type = "Spree::Pages::Taxon"
  p.name = "Taxon"
  p.meta_title = nil
  p.meta_description = nil
end


# Section: Taxon Banner
section = page.sections.find_or_create_by!(name: "Taxon Banner") do |s|
  s.type = "Spree::PageSections::TaxonBanner"
end


# Section: Product Grid
section = page.sections.find_or_create_by!(name: "Product Grid") do |s|
  s.type = "Spree::PageSections::ProductGrid"
end


# Page: Wishlist
page = theme.pages.find_or_create_by!(slug: nil) do |p|
  p.type = "Spree::Pages::Wishlist"
  p.name = "Wishlist"
  p.meta_title = nil
  p.meta_description = nil
end


# Page: SearchResults
page = theme.pages.find_or_create_by!(slug: nil) do |p|
  p.type = "Spree::Pages::SearchResults"
  p.name = "SearchResults"
  p.meta_title = nil
  p.meta_description = nil
end


# Section: Page Title
section = page.sections.find_or_create_by!(name: "Page Title") do |s|
  s.type = "Spree::PageSections::PageTitle"
end


# Section: Product Grid
section = page.sections.find_or_create_by!(name: "Product Grid") do |s|
  s.type = "Spree::PageSections::ProductGrid"
end


# Page: Checkout
page = theme.pages.find_or_create_by!(slug: nil) do |p|
  p.type = "Spree::Pages::Checkout"
  p.name = "Checkout"
  p.meta_title = nil
  p.meta_description = nil
end


# Page: Password
page = theme.pages.find_or_create_by!(slug: nil) do |p|
  p.type = "Spree::Pages::Password"
  p.name = "Password"
  p.meta_title = nil
  p.meta_description = nil
end


# Section: Main Password Header
section = page.sections.find_or_create_by!(name: "Main Password Header") do |s|
  s.type = "Spree::PageSections::MainPasswordHeader"
end


# Section: Newsletter
section = page.sections.find_or_create_by!(name: "Newsletter") do |s|
  s.type = "Spree::PageSections::Newsletter"
end


# Block: Heading
block = section.blocks.find_or_create_by!(name: "Heading") do |b|
  b.type = "Spree::PageBlocks::Heading"
end

# Update block text if present
if true
  block.update!(text: "<!-- BEGIN app/views/layouts/action_text/contents/_content.html.erb --><div class=\"trix-content\">\n  <!-- BEGIN /Users/vitaly/.rvm/gems/ruby-3.4.1/gems/actiontext-8.0.2.1/app/views/action_text/contents/_content.html.erb -->Opening soon\n<!-- END /Users/vitaly/.rvm/gems/ruby-3.4.1/gems/actiontext-8.0.2.1/app/views/action_text/contents/_content.html.erb --></div>\n<!-- END app/views/layouts/action_text/contents/_content.html.erb -->")
end


# Block: Text
block = section.blocks.find_or_create_by!(name: "Text") do |b|
  b.type = "Spree::PageBlocks::Text"
end

# Update block text if present
if true
  block.update!(text: "<!-- BEGIN app/views/layouts/action_text/contents/_content.html.erb --><div class=\"trix-content\">\n  <!-- BEGIN /Users/vitaly/.rvm/gems/ruby-3.4.1/gems/actiontext-8.0.2.1/app/views/action_text/contents/_content.html.erb -->Be the first one to know when we launch.\n<!-- END /Users/vitaly/.rvm/gems/ruby-3.4.1/gems/actiontext-8.0.2.1/app/views/action_text/contents/_content.html.erb --></div>\n<!-- END app/views/layouts/action_text/contents/_content.html.erb -->")
end


# Block: Newsletter Form
block = section.blocks.find_or_create_by!(name: "Newsletter Form") do |b|
  b.type = "Spree::PageBlocks::NewsletterForm"
end

# Update block text if present
if false
  block.update!(text: "")
end


# Section: Main Password Footer
section = page.sections.find_or_create_by!(name: "Main Password Footer") do |s|
  s.type = "Spree::PageSections::MainPasswordFooter"
end


# Page: Login
page = theme.pages.find_or_create_by!(slug: nil) do |p|
  p.type = "Spree::Pages::Login"
  p.name = "Login"
  p.meta_title = nil
  p.meta_description = nil
end


# Page: PostList
page = theme.pages.find_or_create_by!(slug: nil) do |p|
  p.type = "Spree::Pages::PostList"
  p.name = "PostList"
  p.meta_title = nil
  p.meta_description = nil
end


# Section: Page Title
section = page.sections.find_or_create_by!(name: "Page Title") do |s|
  s.type = "Spree::PageSections::PageTitle"
end


# Section: Post Grid
section = page.sections.find_or_create_by!(name: "Post Grid") do |s|
  s.type = "Spree::PageSections::PostGrid"
end


# Page: Account
page = theme.pages.find_or_create_by!(slug: nil) do |p|
  p.type = "Spree::Pages::Account"
  p.name = "Account"
  p.meta_title = nil
  p.meta_description = nil
end


# Page: Homepage
page = theme.pages.find_or_create_by!(slug: nil) do |p|
  p.type = "Spree::Pages::Homepage"
  p.name = "Homepage"
  p.meta_title = nil
  p.meta_description = nil
end


# Section: Image With Text
section = page.sections.find_or_create_by!(name: "Image With Text") do |s|
  s.type = "Spree::PageSections::ImageWithText"
end


# Block: Heading
block = section.blocks.find_or_create_by!(name: "Heading") do |b|
  b.type = "Spree::PageBlocks::Heading"
end

# Update block text if present
if true
  block.update!(text: "<!-- BEGIN app/views/layouts/action_text/contents/_content.html.erb --><div class=\"trix-content\">\n  <!-- BEGIN /Users/vitaly/.rvm/gems/ruby-3.4.1/gems/actiontext-8.0.2.1/app/views/action_text/contents/_content.html.erb --><div>Добро пожаловать!</div>\n<!-- END /Users/vitaly/.rvm/gems/ruby-3.4.1/gems/actiontext-8.0.2.1/app/views/action_text/contents/_content.html.erb --></div>\n<!-- END app/views/layouts/action_text/contents/_content.html.erb -->")
end


# Block: Text
block = section.blocks.find_or_create_by!(name: "Text") do |b|
  b.type = "Spree::PageBlocks::Text"
end

# Update block text if present
if true
  block.update!(text: "<!-- BEGIN app/views/layouts/action_text/contents/_content.html.erb --><div class=\"trix-content\">\n  <!-- BEGIN /Users/vitaly/.rvm/gems/ruby-3.4.1/gems/actiontext-8.0.2.1/app/views/action_text/contents/_content.html.erb --><div>Предлагаем Вам керамогранит из Индии</div>\n<!-- END /Users/vitaly/.rvm/gems/ruby-3.4.1/gems/actiontext-8.0.2.1/app/views/action_text/contents/_content.html.erb --></div>\n<!-- END app/views/layouts/action_text/contents/_content.html.erb -->")
end


# Block: Buttons
block = section.blocks.find_or_create_by!(name: "Buttons") do |b|
  b.type = "Spree::PageBlocks::Buttons"
end

# Update block text if present
if false
  block.update!(text: "")
end


# Section: Featured Taxon
section = page.sections.find_or_create_by!(name: "Featured Taxon") do |s|
  s.type = "Spree::PageSections::FeaturedTaxon"
end


# Section: Featured Taxon
section = page.sections.find_or_create_by!(name: "Featured Taxon") do |s|
  s.type = "Spree::PageSections::FeaturedTaxon"
end


# Section: Image With Text
section = page.sections.find_or_create_by!(name: "Image With Text") do |s|
  s.type = "Spree::PageSections::ImageWithText"
end


# Block: Heading
block = section.blocks.find_or_create_by!(name: "Heading") do |b|
  b.type = "Spree::PageBlocks::Heading"
end

# Update block text if present
if true
  block.update!(text: "<!-- BEGIN app/views/layouts/action_text/contents/_content.html.erb --><div class=\"trix-content\">\n  <!-- BEGIN /Users/vitaly/.rvm/gems/ruby-3.4.1/gems/actiontext-8.0.2.1/app/views/action_text/contents/_content.html.erb -->About us\n<!-- END /Users/vitaly/.rvm/gems/ruby-3.4.1/gems/actiontext-8.0.2.1/app/views/action_text/contents/_content.html.erb --></div>\n<!-- END app/views/layouts/action_text/contents/_content.html.erb -->")
end


# Block: Text
block = section.blocks.find_or_create_by!(name: "Text") do |b|
  b.type = "Spree::PageBlocks::Text"
end

# Update block text if present
if true
  block.update!(text: "<!-- BEGIN app/views/layouts/action_text/contents/_content.html.erb --><div class=\"trix-content\">\n  <!-- BEGIN /Users/vitaly/.rvm/gems/ruby-3.4.1/gems/actiontext-8.0.2.1/app/views/action_text/contents/_content.html.erb -->Welcome to our shop! We carefully curate high-quality products that we believe in. Our process involves rigorous testing and selection to ensure we only offer items that meet our standards. We're passionate about delivering exceptional value and service to our customers.\n<!-- END /Users/vitaly/.rvm/gems/ruby-3.4.1/gems/actiontext-8.0.2.1/app/views/action_text/contents/_content.html.erb --></div>\n<!-- END app/views/layouts/action_text/contents/_content.html.erb -->")
end


puts "✅ Theme content loaded!"

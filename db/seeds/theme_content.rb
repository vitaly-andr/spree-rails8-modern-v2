# Theme Content Seeds
# Generated on 2025-09-06 04:10:30 UTC

puts "🎨 Loading theme content..."

store = Spree::Store.find_by(code: 'shop') || Spree::Store.default

# Update store settings
store.update!(
  name: "Shop",
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
block = section.blocks.find_or_initialize_by(name: "Heading") do |b|
  b.type = "Spree::PageBlocks::Heading"
end

# Update ActionText content properly
if true
  if block.text.present?
    block.text.update!(body: "Opening soon")
  else
    block.update!(text: "Opening soon")
  end
end


# Block: Text
block = section.blocks.find_or_initialize_by(name: "Text") do |b|
  b.type = "Spree::PageBlocks::Text"
end

# Update ActionText content properly
if true
  if block.text.present?
    block.text.update!(body: "Be the first one to know when we launch.")
  else
    block.update!(text: "Be the first one to know when we launch.")
  end
end


# Block: Newsletter Form
block = section.blocks.find_or_initialize_by(name: "Newsletter Form") do |b|
  b.type = "Spree::PageBlocks::NewsletterForm"
end

# Update ActionText content properly
if false
  if block.text.present?
    block.text.update!(body: "")
  else
    block.update!(text: "")
  end
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
block = section.blocks.find_or_initialize_by(name: "Heading") do |b|
  b.type = "Spree::PageBlocks::Heading"
end

# Update ActionText content properly
if true
  if block.text.present?
    block.text.update!(body: "Добро пожаловать!")
  else
    block.update!(text: "Добро пожаловать!")
  end
end


# Block: Text
block = section.blocks.find_or_initialize_by(name: "Text") do |b|
  b.type = "Spree::PageBlocks::Text"
end

# Update ActionText content properly
if true
  if block.text.present?
    block.text.update!(body: "Предлагаем Вам керамогранит из Индии")
  else
    block.update!(text: "Предлагаем Вам керамогранит из Индии")
  end
end


# Block: Buttons
block = section.blocks.find_or_initialize_by(name: "Buttons") do |b|
  b.type = "Spree::PageBlocks::Buttons"
end

# Update ActionText content properly
if false
  if block.text.present?
    block.text.update!(body: "")
  else
    block.update!(text: "")
  end
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
block = section.blocks.find_or_initialize_by(name: "Heading") do |b|
  b.type = "Spree::PageBlocks::Heading"
end

# Update ActionText content properly
if true
  if block.text.present?
    block.text.update!(body: "About us")
  else
    block.update!(text: "About us")
  end
end


# Block: Text
block = section.blocks.find_or_initialize_by(name: "Text") do |b|
  b.type = "Spree::PageBlocks::Text"
end

# Update ActionText content properly
if true
  if block.text.present?
    block.text.update!(body: "Welcome to our shop! We carefully curate high-quality products that we believe in. Our process involves rigorous testing and selection to ensure we only offer items that meet our standards. We're passionate about delivering exceptional value and service to our customers.")
  else
    block.update!(text: "Welcome to our shop! We carefully curate high-quality products that we believe in. Our process involves rigorous testing and selection to ensure we only offer items that meet our standards. We're passionate about delivering exceptional value and service to our customers.")
  end
end


puts "✅ Theme content loaded!"

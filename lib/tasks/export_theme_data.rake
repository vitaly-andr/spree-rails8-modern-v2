# lib/tasks/export_theme_data.rake
namespace :theme do
  desc "Export current theme data to seeds"
  task export: :environment do
    puts "🔄 Exporting theme data..."

    store = Spree::Store.default
    theme = store.default_theme

    # Export store settings
    puts "\n📦 Store Settings:"
    puts "Name: #{store.name}"
    puts "URL: #{store.url}"
    puts "Default Locale: #{store.default_locale}"
    puts "Supported Locales: #{store.supported_locales}"
    puts "Default Currency: #{store.default_currency}"
    puts "Supported Currencies: #{store.supported_currencies}"

    # Export theme pages and sections
    puts "\n🎨 Theme Pages:"
    theme.pages.each do |page|
      puts "Page: #{page.name} (#{page.type})"

      page.sections.each do |section|
        puts "  Section: #{section.name} (#{section.type})"

        section.blocks.each do |block|
          puts "    Block: #{block.name} (#{block.type})"
          if block.text.present?
            text_preview = block.text.to_plain_text.truncate(50)
            puts "      Text: #{text_preview}"
          end
        end
      end
    end

    # Generate seed file content
    seed_content = generate_seed_content(store, theme)

    # Write to file
    File.write(Rails.root.join("db", "seeds", "theme_content.rb"), seed_content)

    puts "\n✅ Theme data exported to db/seeds/theme_content.rb"
    puts "💡 Add 'load Rails.root.join('db', 'seeds', 'theme_content.rb')' to your seeds.rb"
  end

  private

  def generate_seed_content(store, theme)
    content = <<~RUBY
      # Theme Content Seeds
      # Generated on #{Time.current}

      puts "🎨 Loading theme content..."

      store = Spree::Store.find_by(code: '#{store.code}') || Spree::Store.default

      # Update store settings
      store.update!(
        name: #{store.name.inspect},
        default_locale: #{store.default_locale.inspect},
        supported_locales: #{store.supported_locales.inspect},
        default_currency: #{store.default_currency.inspect},
        supported_currencies: #{store.supported_currencies.inspect}
      )

      theme = store.themes.find_by(type: '#{theme.type}') || store.default_theme

    RUBY

    # Add pages and sections
    theme.pages.each do |page|
      content += generate_page_content(page)
    end

    content += "\nputs \"✅ Theme content loaded!\"\n"
    content
  end

  def generate_page_content(page)
    content = <<~RUBY

      # Page: #{page.name}
      page = theme.pages.find_or_create_by!(slug: #{page.slug.inspect}) do |p|
        p.type = #{page.type.inspect}
        p.name = #{page.name.inspect}
        p.meta_title = #{page.meta_title.inspect}
        p.meta_description = #{page.meta_description.inspect}
      end

    RUBY

    page.sections.each do |section|
      content += generate_section_content(section)
    end

    content
  end

  def generate_section_content(section)
    content = <<~RUBY

      # Section: #{section.name}
      section = page.sections.find_or_create_by!(name: #{section.name.inspect}) do |s|
        s.type = #{section.type.inspect}
      end

    RUBY

    section.blocks.each do |block|
      content += generate_block_content(block)
    end

    content
  end

  def generate_block_content(block)
    text_content = block.text.present? ? block.text.body.to_s : ""

    <<~RUBY

      # Block: #{block.name}
      block = section.blocks.find_or_create_by!(name: #{block.name.inspect}) do |b|
        b.type = #{block.type.inspect}
      end

      # Update block text if present
      if #{!text_content.empty?}
        block.update!(text: #{text_content.inspect})
      end

    RUBY
  end
end

# frozen_string_literal: true

namespace :spree do
  desc "Create symlinks to Spree gem JavaScript files"
  task :setup_symlinks do
    puts "🔗 Starting Spree symlinks setup..."

    # Проверяем, что Spree gem установлен
    begin
      require "bundler"
      Bundler.load
    rescue LoadError
      puts "❌ Bundler not available. Please run 'bundle install' first."
      exit 1
    end

    # Проверяем, что Spree gem найден
    spree_spec = Bundler.load.specs.find { |s| s.name == "spree" || s.name == "spree_core" }
    unless spree_spec
      puts "❌ Spree gem not found. Please add Spree to your Gemfile and run 'bundle install'."
      exit 1
    end

    require_relative "../spree_gem_path"

    puts "🔗 Setting up Spree symlinks..."

    begin
      # ИСПРАВЛЕНО: Используем SpreeGemPath.path вместо spree_gem_path
      spree_path = SpreeGemPath.path
      puts "🔍 Spree gem path: #{spree_path}"

      # Создаем директорию для symlink'ов
      symlink_dir = Rails.root.join("app", "frontend", "spree", "gem")
      FileUtils.mkdir_p(symlink_dir)
      puts "📁 Created symlink directory: #{symlink_dir}"

      # Определяем symlink'и для создания
      symlinks = [
        {
          target: File.join(spree_path, "storefront", "app", "javascript", "spree", "storefront", "controllers"),
          link: symlink_dir.join("storefront_controllers"),
          description: "Storefront Controllers"
        },
        {
          target: File.join(spree_path, "core", "app", "javascript", "spree", "core", "controllers"),
          link: symlink_dir.join("core_controllers"),
          description: "Core Controllers"
        },
        {
          target: File.join(spree_path, "core", "app", "javascript", "spree", "core", "helpers"),
          link: symlink_dir.join("core_helpers"),
          description: "Core Helpers"
        },
        {
          target: File.join(spree_path, "core", "vendor", "javascript", "tailwindcss-stimulus-components.js"),
          link: symlink_dir.join("tailwindcss-stimulus-components.js"),
          description: "Tailwind Stimulus Components"
        }
      ]

      success_count = 0

      symlinks.each do |config|
        target = config[:target]
        link_path = config[:link]
        description = config[:description]

        begin
          # Удаляем существующий symlink если есть
          if File.exist?(link_path) || File.symlink?(link_path)
            if File.symlink?(link_path)
              puts "🔄 Removing existing symlink: #{link_path}"
              File.unlink(link_path)
            else
              puts "⚠️ Path exists but is not a symlink: #{link_path}"
              next
            end
          end

          # Проверяем существование целевой директории или файла
          unless File.exist?(target)
            puts "⚠️ Target does not exist: #{target}"
            next
          end

          # Создаем symlink
          File.symlink(target, link_path)
          puts "✅ Created symlink: #{description}"
          puts "   #{link_path} -> #{target}"
          success_count += 1

        rescue => e
          puts "❌ Failed to create symlink for #{description}: #{e.message}"
        end
      end

      puts "\n🎉 Setup complete! Created #{success_count}/#{symlinks.length} symlinks"

      if success_count == symlinks.length
        puts "✅ All Spree symlinks are ready!"
      else
        puts "⚠️ Some symlinks failed to create. Check the errors above."
        exit 1
      end

    rescue => e
      puts "❌ Error setting up symlinks: #{e.message}"
      puts e.backtrace.first(5).join("\n")
      exit 1
    end
  end
end

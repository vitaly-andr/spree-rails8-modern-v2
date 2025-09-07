# Get Spree gem path dynamically
require "bundler"

class SpreeGemPath
  def self.path
    spec = Bundler.load.specs.find { |s| s.name == "spree" }
    return spec.full_gem_path if spec

    # Fallback: try to find spree_core
    spec = Bundler.load.specs.find { |s| s.name == "spree_core" }
    return File.dirname(spec.full_gem_path) if spec

    raise "Spree gem not found in bundle"
  end
end

# Убираем автоматический вывод пути
# puts SpreeGemPath.path

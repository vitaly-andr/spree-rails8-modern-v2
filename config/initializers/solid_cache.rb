# Solid Cache configuration for Rails 8
# This ensures that Solid Cache uses the correct database configuration

Rails.application.configure do
  # For staging environment, make sure we use the solid_cache database
  if Rails.env.staging?
    config.cache_store = :solid_cache_store, {
      database: :solid_cache,
      namespace: Rails.env
    }
  end
end

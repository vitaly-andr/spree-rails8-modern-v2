Rails.application.routes.draw do
  # Admin authentication
  devise_for :admin_users,
    class_name: "Spree::AdminUser",
    controllers: {
      sessions: "spree/admin/user_sessions",
      passwords: "spree/admin/user_passwords"
    },
    skip: :registrations,
    path: :admin_users

  # This line mounts Spree's routes at the root of your application.
  mount Spree::Core::Engine, at: "/"

  Spree::Core::Engine.add_routes do
    # Storefront routes
    scope "(:locale)", locale: /#{Spree.available_locales.join('|')}/, defaults: { locale: nil } do
      devise_for(
        Spree.user_class.model_name.singular_route_key,
        class_name: Spree.user_class.to_s,
        path: :user,
        controllers: {
          sessions: "spree/user_sessions",
          passwords: "spree/user_passwords",
          registrations: "spree/user_registrations"
        },
        router_name: :spree
      )
    end
  end

  # rails-way: тестовый маршрут для проверки frontend-стека
  get "/test_frontend" => "pages#test_frontend"

  # Ceramir landing page
  get "/ceramir" => "pages#ceramir"

  # Storefront components showcase
  get "/storefront" => "pages#storefront"

  # Product detail page
  get "/product/:id" => "pages#product_detail", as: :product_detail

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  root "home#index"
end

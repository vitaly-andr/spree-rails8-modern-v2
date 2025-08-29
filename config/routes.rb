Rails.application.routes.draw do
  # rails-way: тестовый маршрут для проверки frontend-стека
  get "/test_frontend" => "pages#test_frontend"

  # Ceramir landing page
  get "/ceramir" => "pages#ceramir"

  # Storefront components showcase
  get "/storefront" => "pages#storefront"

  # Product detail page
  get "/product/:id" => "pages#product_detail", as: :product_detail

  # Маршруты для анализатора структуры базы данных

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "home#index"
end

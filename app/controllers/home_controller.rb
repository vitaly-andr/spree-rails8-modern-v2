class HomeController < ApplicationController
  def index
    # You can add logic here if needed in the future,
    # for example, to fetch data for the home page.
    @welcome_message = "Welcome to Spree Rails 8 Modern!"
    @links = [
      { name: "Test Frontend Setup", path: "/test_frontend" },
      { name: "Ceramir Landing", path: "/ceramir" },
      { name: "Storefront Components", path: "/storefront" }
      # Add more links as you define new routes and features
    ]
  end

  # Example of another action if you add more pages managed by HomeController
  # def another_page
  #   # ...
  # end
end

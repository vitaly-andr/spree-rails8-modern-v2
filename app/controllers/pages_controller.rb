class PagesController < ApplicationController
  layout "application"

  def test_frontend
    # rails-way: no logic needed for static test
  end

  def ceramir
    # Ceramir landing page with tile and sanitary ware content
  end

  def storefront
    # Storefront components showcase page
  end

  def product_detail
    @product_id = params[:id]
    # Static data for demo (later will be from Spree)
  end

  def websiteceramir
    # WebSite Ceramir documentation page
  end
end

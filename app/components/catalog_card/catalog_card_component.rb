# frozen_string_literal: true

class CatalogCard::CatalogCardComponent < ViewComponent::Base
  def initialize(
    title:,
    subtitle: nil,
    price:,
    image:,
    alt: nil,
    href: "#",
    id: nil,
    on_sale: false,
    sale_price: nil
  )
    @title = title
    @subtitle = subtitle
    @price = price
    @image = image
    @alt = alt || title
    @href = href
    @id = id || SecureRandom.hex(8)
    @on_sale = on_sale
    @sale_price = sale_price
  end

  private

  attr_reader :title, :subtitle, :price, :image, :alt, :href, :id, :on_sale, :sale_price

  def component_id
    "catalog-card-#{id}"
  end

  def formatted_price
    return price unless on_sale && sale_price

    {
      original: price,
      sale: sale_price
    }
  end

  def sale_discount_percent
    return unless on_sale && sale_price

    original = price.gsub(/[^\d.]/, "").to_f
    sale = sale_price.gsub(/[^\d.]/, "").to_f

    return unless original > 0

    ((original - sale) / original * 100).round
  end
end

# frozen_string_literal: true

class ProductDetail::ProductDetailComponent < ViewComponent::Base
  def initialize(
    title:,
    subtitle: nil,
    price:,
    original_price: nil,
    image:,
    images: [],
    media_gallery: [], # NEW: additional media files
    alt: nil,
    href: "#",
    id: nil,
    on_sale: false,
    sale_price: nil,
    # Madera Product Page Design Attributes
    in_stock: true,
    description: nil,
    color: nil,
    material: nil,
    width: nil,
    depth: nil,
    height: nil,
    features: [],
    default_quantity: 1,
    # NEW: Like functionality
    is_liked: false
  )
    @title = title
    @subtitle = subtitle
    @price = price
    @original_price = original_price
    @image = image
    @images = images
    @media_gallery = media_gallery
    @alt = alt || title
    @href = href
    @id = id || SecureRandom.hex(8)
    @on_sale = on_sale
    @sale_price = sale_price
    @in_stock = in_stock
    @description = description
    @color = color
    @material = material
    @width = width
    @depth = depth
    @height = height
    @features = features
    @default_quantity = default_quantity
    @is_liked = is_liked
  end

  private

  attr_reader :title, :subtitle, :price, :original_price, :image, :images, :media_gallery, :alt, :href, :id,
              :on_sale, :sale_price, :in_stock, :description, :color, :material, :width,
              :depth, :height, :features, :default_quantity, :is_liked

  def component_id
    "product-detail-#{id}"
  end

  def formatted_price
    return price unless on_sale && sale_price

    {
      original: original_price || price,
      sale: sale_price
    }
  end

  def sale_discount_percent
    return unless on_sale && sale_price

    original = (original_price || price).gsub(/[^\d.]/, "").to_f
    sale = sale_price.gsub(/[^\d.]/, "").to_f

    return unless original > 0

    ((original - sale) / original * 100).round
  end

  def stock_status
    in_stock ? "In Stock" : "Out of Stock"
  end

  def stock_class
    in_stock ? "text-green-600" : "text-red-600"
  end

  def specifications
    specs = []
    specs << { label: "Color", value: color } if color.present?
    specs << { label: "Material", value: material } if material.present?
    specs << { label: "Width", value: width } if width.present?
    specs << { label: "Depth", value: depth } if depth.present?
    specs << { label: "Height", value: height } if height.present?
    specs
  end

  def has_specifications?
    specifications.any?
  end

  def has_multiple_images?
    images.any?
  end

  def all_images
    [ image ] + images
  end

  def has_features?
    features.any?
  end

  def has_media_gallery?
    media_gallery.any?
  end

  def default_description
    "Transform your living area or workspace with the #{title}, expertly crafted to embody simplicity and elegance. Its clean lines and contemporary design make it a perfect addition to any room, while the high-quality materials ensure durability and comfort."
  end

  def heart_icon_style
    is_liked ? "fill: currentColor; color: #ef4444;" : "fill: none; color: inherit;"
  end
end

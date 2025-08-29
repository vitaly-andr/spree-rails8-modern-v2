# frozen_string_literal: true

class MediaGallery::MediaGalleryComponent < ViewComponent::Base
  def initialize(
    media_items: [],
    id: nil,
    layout: :horizontal, # :horizontal, :vertical, :grid
    max_height: 100,
    enable_scroll: true,
    auto_replace_main: true
  )
    @media_items = media_items
    @id = id || SecureRandom.hex(8)
    @layout = layout
    @max_height = max_height
    @enable_scroll = enable_scroll
    @auto_replace_main = auto_replace_main
  end

  private

  attr_reader :media_items, :id, :layout, :max_height, :enable_scroll, :auto_replace_main

  def component_id
    "media-gallery-#{id}"
  end

  def has_media?
    media_items.any?
  end

  def layout_class
    case layout
    when :horizontal
      "media-gallery-horizontal"
    when :vertical
      "media-gallery-vertical"
    when :grid
      "media-gallery-grid"
    else
      "media-gallery-horizontal"
    end
  end

  def scroll_class
    enable_scroll ? "media-gallery-scrollable" : ""
  end

  def gallery_style
    "max-height: #{max_height}px;" if layout == :vertical
  end

  def processed_media_items
    media_items.map.with_index do |item, index|
      {
        url: item[:url] || item,
        thumbnail: item[:thumbnail] || item[:url] || item,
        alt: item[:alt] || "Media item #{index + 1}",
        type: item[:type] || detect_media_type(item[:url] || item),
        title: item[:title],
        index: index
      }
    end
  end

  def detect_media_type(url)
    return :image unless url.is_a?(String)

    case url.downcase
    when /\.(jpg|jpeg|png|gif|webp|svg)$/
      :image
    when /\.(mp4|mov|avi|webm)$/
      :video
    else
      :image
    end
  end
end

# frozen_string_literal: true

module Carousel
  class CarouselComponent < ViewComponent::Base
    # Включаем все Rails хелперы включая Vite
    delegate :vite_image_tag, :vite_asset_path, to: :helpers

    def initialize(slides: [], id: nil, autoplay: true, autoplay_delay: 3000)
      @slides = slides
      @id = id || SecureRandom.hex(4)
      @autoplay = autoplay
      @autoplay_delay = autoplay_delay
    end

    private

    attr_reader :slides, :id, :autoplay, :autoplay_delay

    def carousel_data_attributes
      {
        controller: "carousel--carousel-component",
        "carousel--carousel-component-id-value": id,
        "carousel--carousel-component-total-slides-value": slides.length,
        "carousel--carousel-component-current-slide-value": 1,
        "carousel--carousel-component-autoplay-value": autoplay,
        "carousel--carousel-component-autoplay-delay-value": autoplay_delay
      }
    end

    def slide_data_attributes(index)
      {
        "carousel--carousel-component-target": "content",
        "slide-index": index
      }
    end
  end
end

# Гибридная архитектура: ViewComponents + Spree PageSections

Руководство по созданию CMS-системы для клиентов с использованием ViewComponents как основы для Spree PageSections.

## 📋 Концепция

### Проблема
Клиенты хотят самостоятельно собирать страницы из готовых блоков через визуальный интерфейс, но нам нужно сохранить контроль над логикой и качеством кода.

### Решение
**Гибридный подход**: создаем ViewComponents (для разработки логики и стилей) и оборачиваем их в PageSections (интерфейс для клиентов).

```
┌── ViewComponents (логика + стили) ──┐
│  ├── ProductDetailComponent         │  ← Разрабатываете вы
│  ├── ProductCardComponent           │
│  ├── CarouselComponent              │
│  └── MediaGalleryComponent          │
└─────────────────────────────────────┘
           ↕️ обёрнуты в
┌── PageSections (UI для клиентов) ───┐
│  ├── ProductDetailSection           │  ← Используют клиенты
│  ├── ProductCardGridSection         │
│  ├── CarouselSection                │
│  └── MediaGallerySection            │
└─────────────────────────────────────┘
           ↕️ управляется через
┌── Spree Admin Interface ────────────┐
│  📄 Page Builder                    │  ← Интерфейс для клиентов
│  🎨 Drag & Drop                     │
│  ⚙️  Visual Settings                 │
│  👁️  Live Preview                   │
└─────────────────────────────────────┘
```
<code_block_to_apply_changes_from>
┌─────────────────────────────────────────────────────────┐
│ 📄 Page: "Новая коллекция осень-зима"                  │
├─────────────────────────────────────────────────────────┤
│ Available Sections:                                     │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │📦 Товар │ │🎠 Карус.│ │🖼️ Галер.│ │📝 Текст │        │
│ │ Product │ │Carousel │ │Gallery  │ │RichText │        │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘        │
├─────────────────────────────────────────────────────────┤
│ Current Page Layout:                                    │
│ ┌─ 🎠 Hero Carousel ────────────────────────┐ [⚙️] [❌] │
│ ├─ 📝 Welcome Text ────────────────────────┤ [⚙️] [❌] │  
│ ├─ 📦 Featured Product ───────────────────┤ [⚙️] [❌] │
│ ├─ 🖼️ Product Gallery ───────────────────┤ [⚙️] [❌] │
│ └─ 📦 Product Grid ───────────────────────┘ [⚙️] [❌] │
│                                                         │
│ [➕ Add Section] [👁️ Preview] [💾 Save] [🚀 Publish]    │
└─────────────────────────────────────────────────────────┘
```

## ✅ Преимущества

### Для разработчиков:
- ✅ **Полный контроль** над логикой через ViewComponents
- ✅ **Переиспользование кода** между проектами
- ✅ **Легкое тестирование** изолированных компонентов
- ✅ **Type safety** с явными параметрами
- ✅ **Быстрая разработка** новых секций

### Для клиентов:
- ✅ **Автономность** - не нужен разработчик для изменений
- ✅ **Визуальный интерфейс** - никакого кода
- ✅ **Мгновенные изменения** - сразу видно результат  
- ✅ **Гибкость** - любые комбинации секций
- ✅ **Профессиональный результат** - качественный код под капотом

### Для проекта:
- ✅ **Масштабируемость** - легко добавлять новые типы секций
- ✅ **Производительность** - оптимизированные ViewComponents
- ✅ **SEO-friendly** - правильная семантика и метатеги
- ✅ **Мобильная адаптивность** - встроена в компоненты

## 🚀 Следующие шаги

1. **Создать базовые PageSections** на основе существующих ViewComponents
2. **Настроить админ-интерфейс** с удобными формами
3. **Добавить предпросмотр** в реальном времени
4. **Создать библиотеку шаблонов** страниц для клиентов
5. **Добавить импорт/экспорт** готовых макетов
6. **Интегрировать с SEO-настройками** и метатегами

## 📚 Дополнительные ресурсы

- [Spree PageSections API](https://docs.spreecommerce.org/)
- [ViewComponent Documentation](https://viewcomponent.org/)
- [Примеры кастомных секций](/doc/ViewComponents/)
- [Настройка админ-интерфейса](/doc/SpreeIntegration.md)

## 🏗️ Архитектура

### 1. ViewComponent (базовая логика)
```ruby
# app/components/product_detail/product_detail_component.rb
class ProductDetailComponent < ViewComponent::Base
  def initialize(product:, show_gallery: true, show_description: true)
    @product = product
    @show_gallery = show_gallery
    @show_description = show_description
  end

  private

  attr_reader :product, :show_gallery, :show_description
end
```

### 2. PageSection (обёртка для CMS)
```ruby
# app/models/spree/page_sections/product_detail_section.rb
module Spree
  module PageSections
    class ProductDetailSection < Spree::PageSection
      # Настройки для клиентов
      preference :product_id, :string, default: ''
      preference :show_gallery, :boolean, default: true
      preference :show_description, :boolean, default: true
      preference :layout_style, :string, default: 'default'
      
      def icon_name
        'package'
      end
      
      def product
        @product ||= store.products.find_by(id: preferred_product_id)
      end
      
      def self.role
        'content'  # Можно добавлять/удалять через админку
      end
    end
  end
end
```

### 3. View Template (связующее звено)
```erb
<!-- app/views/spree/page_sections/_product_detail_section.html.erb -->
<% if section.product.present? %>
  <div class="section-wrapper" style="<%= section_styles(section) %>">
    <%= render ProductDetailComponent.new(
      product: section.product,
      show_gallery: section.preferred_show_gallery,
      show_description: section.preferred_show_description,
      layout_style: section.preferred_layout_style
    ) %>
  </div>
<% end %>
```

### 4. Admin Form (настройки для клиентов)
```erb
<!-- app/views/spree/admin/page_sections/product_detail_section/_form.html.erb -->
<div class="row">
  <div class="col-md-6">
    <div class="form-group">
      <%= f.label :preferred_product_id, "Товар" %>
      <%= f.select :preferred_product_id, 
        options_from_collection_for_select(
          current_store.products.active.limit(100), 
          :id, :name, 
          f.object.preferred_product_id
        ),
        { prompt: "Выберите товар" },
        { class: "form-control select2" } %>
    </div>
  </div>
  
  <div class="col-md-6">
    <div class="form-group">
      <%= f.label :preferred_layout_style, "Стиль отображения" %>
      <%= f.select :preferred_layout_style,
        options_for_select([
          ["По умолчанию", "default"],
          ["Компактный", "compact"],
          ["Расширенный", "extended"]
        ], f.object.preferred_layout_style),
        {},
        { class: "form-control" } %>
    </div>
  </div>
</div>

<div class="row">
  <div class="col-md-6">
    <div class="form-check">
      <%= f.check_box :preferred_show_gallery, class: "form-check-input" %>
      <%= f.label :preferred_show_gallery, "Показывать галерею изображений", class: "form-check-label" %>
    </div>
  </div>
  
  <div class="col-md-6">
    <div class="form-check">
      <%= f.check_box :preferred_show_description, class: "form-check-input" %>
      <%= f.label :preferred_show_description, "Показывать описание товара", class: "form-check-label" %>
    </div>
  </div>
</div>
```

## 📦 Библиотека готовых секций

### 1. Product Card Grid Section
```ruby
# app/models/spree/page_sections/product_card_grid_section.rb
module Spree
  module PageSections
    class ProductCardGridSection < Spree::PageSection
      preference :taxon_id, :string, default: ''
      preference :products_count, :integer, default: 12
      preference :columns_desktop, :integer, default: 4
      preference :columns_tablet, :integer, default: 3
      preference :columns_mobile, :integer, default: 2
      preference :show_sale_badges, :boolean, default: true
      preference :show_wishlist, :boolean, default: true
      preference :sort_by, :string, default: 'position'
      
      def icon_name
        'layout-grid'
      end
      
      def products
        scope = if preferred_taxon_id.present?
          store.products.in_taxon(preferred_taxon_id)
        else
          store.products
        end
        
        scope = case preferred_sort_by
        when 'price_asc'
          scope.joins(:prices).order('spree_prices.amount ASC')
        when 'price_desc'
          scope.joins(:prices).order('spree_prices.amount DESC')
        when 'name'
          scope.order(:name)
        else
          scope.order(:position)
        end
        
        scope.active.limit(preferred_products_count)
      end
      
      def grid_classes
        "grid-cols-#{preferred_columns_mobile} md:grid-cols-#{preferred_columns_tablet} lg:grid-cols-#{preferred_columns_desktop}"
      end
    end
  end
end
```

### 2. Carousel Section
```ruby
# app/models/spree/page_sections/carousel_section.rb
module Spree
  module PageSections
    class CarouselSection < Spree::PageSection
      # Слайд 1
      preference :slide_1_title, :string, default: ''
      preference :slide_1_subtitle, :string, default: ''
      preference :slide_1_button_text, :string, default: ''
      preference :slide_1_button_url, :string, default: ''
      
      # Слайд 2  
      preference :slide_2_title, :string, default: ''
      preference :slide_2_subtitle, :string, default: ''
      preference :slide_2_button_text, :string, default: ''
      preference :slide_2_button_url, :string, default: ''
      
      # Слайд 3
      preference :slide_3_title, :string, default: ''
      preference :slide_3_subtitle, :string, default: ''
      preference :slide_3_button_text, :string, default: ''
      preference :slide_3_button_url, :string, default: ''
      
      # Настройки
      preference :autoplay, :boolean, default: true
      preference :autoplay_speed, :integer, default: 3000
      preference :show_indicators, :boolean, default: true
      
      def icon_name
        'play-circle'
      end
      
      def slides_data
        [
          {
            title: preferred_slide_1_title,
            subtitle: preferred_slide_1_subtitle,
            button_text: preferred_slide_1_button_text,
            button_url: preferred_slide_1_button_url,
            image: slide_image(1)
          },
          {
            title: preferred_slide_2_title,
            subtitle: preferred_slide_2_subtitle,
            button_text: preferred_slide_2_button_text,
            button_url: preferred_slide_2_button_url,
            image: slide_image(2)
          },
          {
            title: preferred_slide_3_title,
            subtitle: preferred_slide_3_subtitle,
            button_text: preferred_slide_3_button_text,
            button_url: preferred_slide_3_button_url,
            image: slide_image(3)
          }
        ].select { |slide| slide[:title].present? }
      end
      
      private
      
      def slide_image(number)
        # Логика получения изображения из Active Storage или URL
        blocks.find_by(position: number)&.asset
      end
    end
  end
end
```

### 3. Media Gallery Section
```ruby
# app/models/spree/page_sections/media_gallery_section.rb
module Spree
  module PageSections
    class MediaGallerySection < Spree::PageSection
      preference :layout_type, :string, default: 'grid' # grid, masonry, slider
      preference :columns_count, :integer, default: 3
      preference :show_captions, :boolean, default: true
      preference :lightbox_enabled, :boolean, default: true
      preference :aspect_ratio, :string, default: 'square' # square, portrait, landscape, auto
      
      def icon_name
        'image'
      end
      
      def images
        blocks.where(type: 'Spree::PageBlocks::Image').includes(:asset)
      end
      
      def self.role
        'content'
      end
      
      # Создаём блоки по умолчанию для загрузки изображений
      def default_blocks
        [
          Spree::PageBlocks::Image.new(position: 1),
          Spree::PageBlocks::Image.new(position: 2),
          Spree::PageBlocks::Image.new(position: 3)
        ]
      end
      
      def blocks_available?
        true
      end
      
      def available_blocks_to_add
        [Spree::PageBlocks::Image]
      end
      
      def can_sort_blocks?
        true
      end
    end
  end
end
```

### 4. Rich Text Section
```ruby
# app/models/spree/page_sections/rich_text_section.rb
module Spree
  module PageSections
    class RichTextSection < Spree::PageSection
      has_rich_text :content
      
      preference :text_alignment, :string, default: 'left'
      preference :font_size, :string, default: 'base'
      preference :max_width, :string, default: 'full'
      preference :add_padding, :boolean, default: true
      
      def icon_name
        'type'
      end
      
      def text_classes
        classes = []
        classes << "text-#{preferred_text_alignment}"
        classes << "text-#{preferred_font_size}"
        classes << "max-w-#{preferred_max_width}"
        classes << "px-4 py-8" if preferred_add_padding
        classes.join(' ')
      end
    end
  end
end
```

## 🎨 View Templates для секций

### Product Card Grid Template
```erb
<!-- app/views/spree/page_sections/_product_card_grid_section.html.erb -->
<div class="product-grid-section py-8" style="<%= section_styles(section) %>">
  <div class="container mx-auto px-4">
    <div class="grid <%= section.grid_classes %> gap-6">
      <% section.products.each do |product| %>
        <%= render ProductCardComponent.new(
          product: product,
          show_sale_badge: section.preferred_show_sale_badges,
          show_wishlist: section.preferred_show_wishlist
        ) %>
      <% end %>
    </div>
  </div>
</div>
```

### Carousel Template
```erb
<!-- app/views/spree/page_sections/_carousel_section.html.erb -->
<div class="carousel-section" style="<%= section_styles(section) %>">
  <%= render CarouselComponent.new(
    slides: section.slides_data,
    autoplay: section.preferred_autoplay,
    autoplay_speed: section.preferred_autoplay_speed,
    show_indicators: section.preferred_show_indicators
  ) %>
</div>
```

### Media Gallery Template
```erb
<!-- app/views/spree/page_sections/_media_gallery_section.html.erb -->
<div class="media-gallery-section py-8" style="<%= section_styles(section) %>">
  <%= render MediaGalleryComponent.new(
    images: section.images,
    layout: section.preferred_layout_type,
    columns: section.preferred_columns_count,
    show_captions: section.preferred_show_captions,
    lightbox: section.preferred_lightbox_enabled,
    aspect_ratio: section.preferred_aspect_ratio
  ) %>
</div>
```

### Rich Text Template
```erb
<!-- app/views/spree/page_sections/_rich_text_section.html.erb -->
<div class="rich-text-section" style="<%= section_styles(section) %>">
  <div class="container mx-auto">
    <div class="<%= section.text_classes %>">
      <%= section.content %>
    </div>
  </div>
</div>
```

## ⚙️ Регистрация кастомных секций

```ruby
# config/initializers/spree.rb
Rails.application.config.to_prepare do
  # Добавляем кастомные PageSections в доступные типы
  Rails.application.config.spree.page_sections += [
    Spree::PageSections::ProductDetailSection,
    Spree::PageSections::ProductCardGridSection,
    Spree::PageSections::CarouselSection,
    Spree::PageSections::MediaGallerySection,
    Spree::PageSections::RichTextSection
  ]
end
```

## 🎛️ Helper методы

```ruby
# app/helpers/spree/page_sections_helper.rb
module Spree
  module PageSectionsHelper
    def section_styles(section)
      styles = []
      
      # Цвета
      styles << "color: #{section.preferred_text_color}" if section.preferred_text_color.present?
      styles << "background-color: #{section.preferred_background_color}" if section.preferred_background_color.present?
      
      # Отступы
      styles << "padding-top: #{section.preferred_top_padding}px"
      styles << "padding-bottom: #{section.preferred_bottom_padding}px"
      
      # Границы
      if section.preferred_top_border_width > 0
        styles << "border-top: #{section.preferred_top_border_width}px solid #{section.preferred_border_color || '#e5e7eb'}"
      end
      
      if section.preferred_bottom_border_width > 0
        styles << "border-bottom: #{section.preferred_bottom_border_width}px solid #{section.preferred_border_color || '#e5e7eb'}"
      end
      
      styles.join('; ')
    end
  end
end
```

## 📋 Использование клиентами

### Workflow для клиентов:
1. **Заходят в Spree Admin** → Pages → Create New Page
2. **Выбирают доступные секции** из библиотеки (ваши кастомные секции)
3. **Настраивают каждую секцию** через удобные формы
4. **Перетаскивают секции** для изменения порядка
5. **Просматривают результат** в реальном времени
6. **Публикуют страницу** одним кликом

### Интерфейс выглядит так:
```
┌─────────────────────────────────────────────────────────┐
│ 📄 Page: "Новая коллекция осень-зима"                  │
├─────────────────────────────────────────────────────────┤
│ Available Sections:                                     │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │📦 Товар │ │🎠 Карус.│ │🖼️ Галер.│ │📝 Текст │        │
│ │ Product │ │Carousel │ │Gallery  │ │RichText │        │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘        │
│ Current Page Layout:                                    │
│ ┌─ 🎠 Hero Carousel ────────────────────────┐ [⚙️] [❌] │
│ ├─ 📝 Welcome Text ────────────────────────┤ [⚙️] [❌] │  
│ ├─ 📦 Featured Product ───────────────────┤ [⚙️] [❌] │
│ ├─ 🖼️ Product Gallery ───────────────────┤ [⚙️] [❌] │
│ └─ 📦 Product Grid ───────────────────────┘ [⚙️] [❌] │
│                                                         │
│ [➕ Add Section] [👁️ Preview] [💾 Save] [🚀 Publish]    │
└─────────────────────────────────────────────────────────┘
```

## 📝 Заключение

В данной документации описан гибридный подход к созданию CMS-системы на базе Spree, где ViewComponents отвечают за реализацию бизнес-логики и визуального стиля, а PageSections предоставляют клиентам инструменты для самостоятельного построения страниц. Такой подход объединяет лучшие практики разработки и позволяет обеспечить гибкость и масштабируемость, удовлетворяя потребности как разработчиков, так и конечных пользователей.

## ❓ FAQ

**Вопрос:** Зачем использовать гибридный подход, если Spree уже имеет свою систему PageSections?  
**Ответ:** Spree отказался от использования ViewComponents для внутренних нужд, но гибридный подход позволяет сохранить преимущества ViewComponents (тестируемость, переиспользуемость и типизацию) и при этом предоставить клиентам удобный UI для самостоятельного редактирования страниц.

**Вопрос:** Можно ли продолжать использовать только ViewComponents или PageSections?  
**Ответ:** Да, выбор остается за вами. Если ваши требования больше ориентированы на разработку с минимальным участием клиента, вполне можно использовать только ViewComponents. Гибридный подход же позволяет объединить лучшие качества обоих методов.

**Вопрос:** Как обеспечить совместимость этих решений с будущими обновлениями Spree?  
**Ответ:** Рекомендуется следить за официальной документацией Spree и обновлять кастомные секции с учетом изменений в API Spree PageSections, а также регулярно рефакторить ViewComponents для поддержания кода в актуальном состоянии.

## 📚 Дополнительные ресурсы

- [Spree PageSections API](https://docs.spreecommerce.org/)
- [ViewComponent Documentation](https://viewcomponent.org/)
- [Примеры кастомных секций](/doc/ViewComponents/)
- [Настройка админ-интерфейса](/doc/SpreeIntegration.md)

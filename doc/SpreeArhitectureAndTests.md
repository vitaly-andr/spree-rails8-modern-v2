# Spree Architecture and Testing Strategy

## 🏗️ Архитектура Spree PageSections

### 1. Иерархия моделей в Spree

```
Spree::PageSection (базовый класс)
    ↓
Spree::PageSections::Header (родительский класс из Spree)
    ↓
Spree::PageSections::EnhancedHeader (наш кастомный класс)
```
<code_block_to_apply_changes_from>
```
Country → Store → Theme → PageSection
```

### 3. Система Preferences в Spree

```ruby
# Определение preference в модели
preference :menu_items, :text, default: -> { default_menu_items.to_json }
preference :enable_animations, :boolean, default: true

# Использование в коде
section.preferred_menu_items     # => JSON string
section.preferred_enable_animations # => boolean

# Сохранение в БД
# Все preferences сериализуются в поле 'preferences' как JSON
```

## 🧪 Стратегия тестирования

### 1. Проблемы с тестированием Spree моделей

#### Избыточность зависимостей
```ruby
# Для создания EnhancedHeader нужно:
let(:country) { Spree::Country.create!(...) }    # Справочник стран
let(:store) { Spree::Store.create!(...) }        # Интернет-магазин
let(:theme) { Spree::Theme.create!(...) }        # Тема оформления
subject { described_class.new(pageable: theme) } # Наша секция
```

#### Почему каждая зависимость необходима:

**Country:**
- `Spree::Store` имеет валидацию `validates :default_country, presence: true`
- Country - справочная модель для стран в Spree
- В реальном приложении загружается через seeds

**Store:**
- Центральная сущность в Spree (интернет-магазин)
- Все остальные сущности привязаны к Store
- Содержит базовые настройки магазина
- Валидации: `validates :name, :url, :mail_from_address, :default_currency, :default_country, :code`

**Theme:**
- Набор страниц и секций для конкретного магазина
- PageSections привязываются к Theme через `pageable`
- В Theme хранятся дизайн-секции (header, footer, content sections)

### 2. Альтернативные подходы к тестированию

#### Подход 1: FactoryBot (рекомендуемый)

```ruby
# spec/factories/spree_page_sections_enhanced_headers.rb
FactoryBot.define do
  factory :country, class: 'Spree::Country' do
    name { "United States" }
    iso { "US" }
    iso3 { "USA" }
    iso_name { "UNITED STATES" }
  end

  factory :store, class: 'Spree::Store' do
    name { "Test Store" }
    code { "test" }
    url { "test.com" }
    mail_from_address { "test@test.com" }
    default_currency { "USD" }
    association :default_country, factory: :country
  end

  factory :theme, class: 'Spree::Theme' do
    name { "Test Theme" }
    association :store
  end

  factory :enhanced_header, class: 'Spree::PageSections::EnhancedHeader' do
    association :pageable, factory: :theme
    name { "Enhanced Header" }
  end
end

# В тестах:
RSpec.describe Spree::PageSections::EnhancedHeader do
  let(:enhanced_header) { create(:enhanced_header) }
  
  it "has correct preferences" do
    expect(enhanced_header.preferred_enable_animations).to be true
  end
end
```

#### Подход 2: Shared contexts

```ruby
# spec/support/spree_setup.rb
RSpec.shared_context "spree_setup" do
  let(:country) do
    Spree::Country.create!(
      name: "United States",
      iso: "US",
      iso3: "USA", 
      iso_name: "UNITED STATES"
    )
  end
  
  let(:store) do
    Spree::Store.create!(
      name: "Test Store",
      code: "test",
      url: "test.com",
      mail_from_address: "test@test.com",
      default_currency: "USD",
      default_country: country
    )
  end
  
  let(:theme) { Spree::Theme.create!(name: "Test Theme", store: store) }
end

# В тестах:
RSpec.describe Spree::PageSections::EnhancedHeader do
  include_context "spree_setup"
  
  subject { described_class.new(pageable: theme) }
  
  # тесты
end
```

#### Подход 3: Мокирование (только для unit-тестов)

```ruby
RSpec.describe Spree::PageSections::EnhancedHeader do
  let(:mock_store) { instance_double("Spree::Store", id: 1) }
  let(:mock_theme) do
    instance_double(
      "Spree::Theme",
      id: 1,
      store: mock_store
    )
  end
  
  subject { described_class.new(pageable: mock_theme) }
  
  # Внимание: не тестируем реальные валидации!
  # Используйте только для изолированного тестирования логики
end
```

### 3. Разделение типов тестов

#### Unit тесты (быстрые, изолированные)

```ruby
describe "#menu_items_data" do
  let(:instance) { described_class.allocate.tap(&:initialize) }
  
  it "parses JSON correctly" do
    instance.preferred_menu_items = '[{"type":"link","label":"Test"}]'
    result = instance.menu_items_data
    expect(result).to be_an(Array)
    expect(result.first["type"]).to eq("link")
  end
  
  it "handles empty JSON" do
    instance.preferred_menu_items = ""
    expect(instance.menu_items_data).to eq([])
  end
  
  it "handles invalid JSON gracefully" do
    instance.preferred_menu_items = "invalid json"
    result = instance.menu_items_data
    expect(result).to be_an(Array)
    expect(result).not_to be_empty
  end
end
```

#### Integration тесты (медленные, с БД)

```ruby
describe "database persistence", type: :integration do
  include_context "spree_setup"
  
  it "saves and loads preferences correctly" do
    section = described_class.create!(
      pageable: theme,
      preferred_menu_items: '[{"type":"link","label":"Home"}]',
      preferred_enable_animations: false
    )
    
    reloaded = described_class.find(section.id)
    expect(reloaded.preferred_enable_animations).to be false
    expect(reloaded.menu_items_data.first["label"]).to eq("Home")
  end
  
  it "validates presence of pageable" do
    section = described_class.new(pageable: nil)
    expect(section).not_to be_valid
    expect(section.errors[:pageable]).to include("не может быть пустым")
  end
end
```

## 🔄 Как это работает в реальности

### 1. Создание EnhancedHeader в админке

```ruby
# app/controllers/spree/admin/page_sections_controller.rb
class Spree::Admin::PageSectionsController < Spree::Admin::BaseController
  def create
    @theme = current_store.themes.find(params[:theme_id])
    
    @section = Spree::PageSections::EnhancedHeader.new(
      pageable: @theme,
      preferences: section_params
    )
    
    if @section.save
      redirect_to admin_theme_path(@theme), notice: 'Header created successfully'
    else
      render :new
    end
  end

  private

  def section_params
    params.require(:enhanced_header).permit(
      :preferred_menu_items,
      :preferred_enable_animations,
      :preferred_scroll_behavior,
      :preferred_mobile_breakpoint,
      :preferred_logo_url,
      :preferred_logo_height,
      :preferred_mobile_logo_height
    )
  end
end
```

### 2. Сохранение и загрузка preferences

```ruby
# Создание с preferences
section = Spree::PageSections::EnhancedHeader.create!(
  pageable: theme,
  preferred_menu_items: '[{"type":"link","label":"Home","url":"/"}]',
  preferred_enable_animations: true,
  preferred_logo_url: "/assets/logo.svg"
)

# В БД сохраняется как JSON в поле preferences:
# {
#   "menu_items": "[{\"type\":\"link\",\"label\":\"Home\",\"url\":\"/\"}]",
#   "enable_animations": true,
#   "logo_url": "/assets/logo.svg"
# }

# При загрузке из БД:
section.preferred_menu_items      # => строка JSON
section.menu_items_data           # => массив хешей (наш метод)
section.preferred_enable_animations # => true
```

### 3. Рендеринг на фронтенде

```ruby
# app/controllers/spree/pages_controller.rb
def show
  @page = current_store.pages.find_by(slug: params[:slug])
  @theme = @page.theme
  @header_section = @theme.sections.find_by(type: 'Spree::PageSections::EnhancedHeader')
end

# app/views/spree/pages/show.html.slim
= render @header_section if @header_section

# app/views/spree/page_sections/_enhanced_header.html.slim
= render Navbar::NavbarComponent.new(section: section)
```

### 4. Интеграция с ViewComponent

```ruby
# app/components/navbar/navbar_component.rb
module Navbar
  class NavbarComponent < ViewComponent::Base
    def initialize(section: nil, **options)
      @section = section
      @menu_items = extract_menu_items(section)
      @options = options
    end

    private

    def extract_menu_items(section)
      if section.respond_to?(:menu_items_data)
        section.menu_items_data
      else
        default_menu_items
      end
    end

    def animations_enabled?
      return section.preferred_enable_animations if section.respond_to?(:preferred_enable_animations)
      true
    end
  end
end
```

## 🎯 Рекомендации по тестированию

### 1. Используйте FactoryBot для сложных зависимостей

```ruby
# Лучше:
let(:enhanced_header) { create(:enhanced_header) }

# Чем:
let(:country) { Spree::Country.create!(...) }
let(:store) { Spree::Store.create!(default_country: country, ...) }
let(:theme) { Spree::Theme.create!(store: store, ...) }
let(:enhanced_header) { described_class.new(pageable: theme) }
```

### 2. Настройте database_cleaner правильно

```ruby
# spec/rails_helper.rb
RSpec.configure do |config|
  config.use_transactional_fixtures = false
  
  config.before(:suite) do
    DatabaseCleaner.clean_with(:truncation)
  end
  
  config.before(:each) do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.start
  end
  
  config.after(:each) do
    DatabaseCleaner.clean
  end
  
  config.before(:each, type: :integration) do
    DatabaseCleaner.strategy = :truncation
  end
end
```

### 3. Разделяйте типы тестов

```ruby
# Быстрые unit-тесты для логики
describe "#menu_items_data" do
  # изолированное тестирование методов
end

# Медленные integration-тесты для валидаций и связей
describe "validations", type: :integration do
  include_context "spree_setup"
  # тестирование с реальными объектами БД
end

# Feature-тесты для пользовательских сценариев
describe "admin interface", type: :feature do
  # тестирование через браузер с Capybara
end
```

## 🔧 Заключение

### Текущие моки оправданы, потому что:

1. **Тестируем реальные валидации и связи** - убеждаемся, что модель работает с настоящими Spree валидациями
2. **Проверяем интеграцию с архитектурой** - модель должна корректно работать в экосистеме Spree
3. **Гарантируем работоспособность в продакшене** - если тест проходит, то модель будет работать с реальными данными

### Оптимизации:

1. **FactoryBot** - упрощает создание сложных объектов
2. **Shared contexts** - переиспользование setup'а между тестами
3. **Разделение типов тестов** - unit/integration/feature
4. **Database cleaner** - правильная очистка БД между тестами

### Баланс между скоростью и надежностью:

- **Unit-тесты** для логики методов (быстрые)
- **Integration-тесты** для валидаций и связей (медленные, но необходимые)
- **Feature-тесты** для пользовательских сценариев (самые медленные)

**Вывод:** "Тяжелые" тесты с реальными зависимостями дают уверенность в
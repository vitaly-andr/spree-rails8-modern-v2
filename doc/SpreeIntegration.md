# Spree Integration Plan - Микрофронтенд архитектура

## Концепция

Интеграция современного фронтенда с Spree через микрофронтенд архитектуру для избежания конфликтов зависимостей и сохранения функциональности админки.

### Структура разделения:
```
spree-rails8-modern/
├── /admin          ← Spree админка (старые стили, Sprockets)
├── /shop           ← Современный фронт (Vite, ViewComponents)  
└── /api            ← API для коммуникации
```

## 1. Роутинг и изоляция

### config/routes.rb
```ruby
Rails.application.routes.draw do
  # Spree админка - изолированная зона
  mount Spree::Core::Engine, at: '/admin'
  
  # Современный магазин
  scope '/shop' do
    root 'shop/home#index'
    resources :products, only: [:index, :show], controller: 'shop/products'
    resources :categories, only: [:index, :show], controller: 'shop/categories'
    get 'cart', to: 'shop/cart#show'
    post 'cart/add/:product_id', to: 'shop/cart#add', as: :add_to_cart
  end
  
  # API для фронтенда (если нужно)
  namespace :api do
    namespace :v1 do
      resources :products, only: [:index, :show]
      resources :cart_items, only: [:create, :update, :destroy]
    end
  end
  
  # Редирект с корня на магазин
  root 'shop/home#index'
end
```

## 2. Контроллеры и изоляция

### Базовые контроллеры

```ruby
# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  # Базовый контроллер для всего приложения
end

# app/controllers/shop/base_controller.rb
class Shop::BaseController < ApplicationController
  layout 'shop'
  
  before_action :set_current_store
  
  private
  
  def set_current_store
    @current_store = Spree::Store.current
  end
end

# app/controllers/admin/base_controller.rb  
class Admin::BaseController < Spree::Admin::BaseController
  # Наследуемся от Spree контроллера для админки
end
```

### Контроллеры магазина

```ruby
# app/controllers/shop/products_controller.rb
class Shop::ProductsController < Shop::BaseController
  def index
    @products = Spree::Product.available.includes(:images, :variants)
    
    # Адаптируем данные для ViewComponents
    @product_cards = @products.map do |product|
      {
        id: product.slug,
        title: product.name,
        price: product.display_price.to_s,
        image: product.images.first&.url(:large),
        href: shop_product_path(product),
        on_sale: product.on_sale?,
        sale_price: product.display_sale_price.to_s
      }
    end
  end
  
  def show
    @product = Spree::Product.friendly.find(params[:id])
    
    # Данные для ProductDetailComponent
    @product_data = {
      title: @product.name,
      subtitle: @product.description&.truncate(100),
      price: @product.display_price.to_s,
      original_price: (@product.compare_at_price if @product.on_sale?),
      image: @product.images.first&.url(:large),
      images: @product.images.map { |img| img.url(:large) },
      alt: @product.name,
      id: @product.slug,
      on_sale: @product.on_sale?,
      in_stock: @product.in_stock?,
      # Характеристики
      color: @product.property('color'),
      material: @product.property('material'),
      width: @product.property('width')
    }
  end
end
```

```ruby
# app/controllers/shop/cart_controller.rb
class Shop::CartController < Shop::BaseController
  def show
    @order = current_order || Spree::Order.new
  end
  
  def add
    @product = Spree::Product.find(params[:product_id])
    @order = current_order(create_order_if_necessary: true)
    
    @line_item = @order.contents.add(
      @product.master, 
      params[:quantity].to_i || 1
    )
    
    if @line_item.errors.empty?
      redirect_to shop_cart_path, notice: 'Товар добавлен в корзину'
    else
      redirect_back(fallback_location: shop_product_path(@product))
    end
  end
  
  private
  
  def current_order(options = {})
    @current_order ||= find_current_order
    @current_order ||= create_order if options[:create_order_if_necessary]
    @current_order
  end
  
  def find_current_order
    return nil unless session[:order_id]
    Spree::Order.find_by(id: session[:order_id], state: 'cart')
  end
  
  def create_order
    order = Spree::Order.create!(
      currency: Spree::Store.current.default_currency,
      store: Spree::Store.current
    )
    session[:order_id] = order.id
    order
  end
end
```

## 3. Лейауты и изоляция стилей

### Лейаут для современного магазина

```slim
<!-- app/views/layouts/shop.html.slim -->
doctype html
html
  head
    meta charset="utf-8"
    meta name="viewport" content="width=device-width, initial-scale=1"
    title = content_for(:title) || "Modern Shop"
    
    <!-- Современные стили через Vite -->
    = vite_client_tag
    = vite_stylesheet_tag 'application.css'
    
  body
    = yield
    
    <!-- Современные скрипты -->
    = vite_javascript_tag 'application.js'
```

### Конфигурация Assets

```ruby
# config/application.rb
class Application < Rails::Application
  # Отключаем автоматическую компиляцию для админки в продакшене
  config.assets.precompile += %w[
    spree/backend/all.css
    spree/backend/all.js
    spree/frontend/all.css  
    spree/frontend/all.js
  ]
  
  # Отключить Sprockets для ваших файлов
  config.assets.precompile -= %w[application.js application.css]
end
```

## 4. Структура файлов

```
app/
├── controllers/
│   ├── admin/           ← Кастомные админ контроллеры (если нужны)
│   └── shop/            ← Контроллеры для магазина
│       ├── base_controller.rb
│       ├── products_controller.rb
│       ├── cart_controller.rb
│       ├── checkout_controller.rb
│       └── home_controller.rb
├── views/
│   ├── layouts/
│   │   ├── shop.html.slim           ← Современный лейаут
│   │   └── spree_application.html.erb ← Spree лейаут
│   └── shop/            ← View файлы для магазина
│       ├── products/
│       ├── cart/
│       └── home/
└── components/          ← ViewComponents (без изменений)
    ├── product_detail/
    ├── catalog_card/
    ├── carousel/
    └── media_gallery/
```

## 5. Настройка Spree

### Gemfile
```ruby
# Spree gems
gem 'spree', '~> 4.6'
gem 'spree_gateway', '~> 3.10'
gem 'spree_auth_devise', '~> 4.5'

# Для совместимости
gem 'sassc-rails', '~> 2.1'
gem 'image_processing', '~> 1.2'
```

### Инициализация Spree
```ruby
# config/initializers/spree.rb
Spree.config do |config|
  # Настройки для работы с современным фронтендом
  config.admin_interface_logo = 'logo/spree_50.png'
  config.admin_products_per_page = 50
  
  # Отключить автоматические стили Spree для фронтенда
  config.use_static_preferences = false
end
```

## 6. План миграции

### Этап 1: Подготовка
1. Создать ветку `spree-integration`
2. Добавить Spree gems в Gemfile
3. Настроить роутинг и базовые контроллеры

### Этап 2: Интеграция админки
1. Запустить Spree установку: `rails generate spree:install`
2. Настроить админку на `/admin`
3. Создать тестовые товары через админку

### Этап 3: Адаптация фронтенда
1. Создать Shop контроллеры
2. Адаптировать ViewComponents для работы с Spree моделями
3. Настроить корзину и checkout

### Этап 4: Тестирование
1. Проверить изоляцию стилей
2. Убедиться что админка работает
3. Протестировать весь flow покупки

## 7. Преимущества решения

### ✅ Изоляция
- Нет конфликтов зависимостей
- Spree стили только в `/admin`
- Современный стек в `/shop`

### ✅ Функциональность
- Админка остается полностью рабочей
- Клиенты могут управлять товарами
- Все возможности Spree доступны

### ✅ Гибкость
- Постепенная миграция страниц
- Безопасное тестирование
- Возможность отката

### ✅ Производительность
- Современный фронтенд для пользователей
- Быстрая загрузка через Vite
- Хорошее SEO

## 8. Потенциальные проблемы

### Сессии и аутентификация
```ruby
# Общие сессии между админкой и магазином
# config/application.rb
config.session_store :cookie_store, key: '_spree_session'
```

### Изображения и файлы
```ruby
# Настройка Active Storage для изображений товаров
# config/storage.yml
local:
  service: Disk
  root: <%= Rails.root.join("storage") %>
```

### API совместимость
```ruby
# Если нужно API для мобильных приложений
# app/controllers/api/v1/base_controller.rb
class Api::V1::BaseController < ActionController::API
  include Spree::Api::ControllerSetup
end
```

## 🔐 Authentication Setup

### Spree Storefront Authentication Controllers

For proper authentication functionality (login/register forms in slideover panels), you need to generate Spree authentication controllers:

```bash
# Generate Spree Storefront Devise controllers
rails generate spree:storefront:devise
```

This command creates:
- `app/controllers/spree/user_sessions_controller.rb` - Login functionality
- `app/controllers/spree/user_passwords_controller.rb` - Password reset
- `app/controllers/spree/user_registrations_controller.rb` - User registration

### What it does:
- Creates controllers that inherit from Devise controllers
- Includes `Spree::Storefront::DeviseConcern` for proper integration
- Sets up proper routes for authentication
- Enables slideover account panel functionality

### Required for:
- Account slideover panel (`#slideover-account`)
- User login/registration forms
- Password reset functionality
- Proper Spree authentication flow

**Note:** This is required even if you already have admin authentication set up, as storefront and admin use different controller namespaces.

## 🔐 Authentication Architecture & Generators

### Dual Authentication System

Spree использует **две отдельные системы аутентификации** через Devise:

#### 1. **Storefront Users** (покупатели)
- **Модель:** `User` (наследует от `Spree.base_class`)
- **Маршруты:** `/user/sign_in`, `/user/sign_up`, `/user/password/new`
- **Контроллеры:** `spree/user_sessions`, `spree/user_passwords`, `spree/user_registrations`
- **Назначение:** Регистрация и вход покупателей в магазине
- **Функции:** Заказы, адреса, wishlist, профиль

#### 2. **Admin Users** (администраторы)
- **Модель:** `AdminUser` (наследует от `ApplicationRecord`)
- **Маршруты:** `/admin_user/sign_in`, `/admin_user/password/new`
- **Контроллеры:** `spree/admin/user_sessions`, `spree/admin/user_passwords`
- **Назначение:** Доступ к админ панели Spree
- **Функции:** Управление товарами, заказами, настройками

### Преимущества разделения:
✅ **Безопасность** - админы изолированы от покупателей  
✅ **Разные права доступа** - отдельные роли и разрешения  
✅ **Независимые интерфейсы** - админка и storefront не пересекаются  
✅ **Гибкость настройки** - можно настраивать системы независимо  

## 🛠️ Spree Generators

### Основные генераторы установки:

#### 1. **Main Install Generator**
```bash
rails generate spree:install [options]
```

**Опции:**
- `--user_class=User` - класс пользователей (по умолчанию `Spree::User`)
- `--install_admin=true` - установить админ панель
- `--install_storefront=true` - установить storefront
- `--authentication=devise` - система аутентификации (devise/custom)
- `--migrate=true` - запустить миграции
- `--seed=true` - загрузить базовые данные
- `--sample=false` - загрузить тестовые данные
- `--admin_email=admin@example.com` - email первого админа
- `--admin_password=password` - пароль первого админа

**Пример:**
```bash
rails generate spree:install --user_class=User --install_admin=true --install_storefront=true --authentication=devise
```

#### 2. **Storefront Authentication Generator** ⚠️ **КРИТИЧЕСКИ ВАЖЕН**
```bash
rails generate spree:storefront:devise
```

**Что создает:**
- `app/controllers/spree/user_sessions_controller.rb` - вход пользователей
- `app/controllers/spree/user_passwords_controller.rb` - восстановление пароля
- `app/controllers/spree/user_registrations_controller.rb` - регистрация
- Добавляет маршруты в `config/routes.rb`

**Когда нужен:**
- При ошибке `uninitialized constant Spree::UserSessionsController`
- Когда не работают формы входа/регистрации в storefront
- После установки Spree для активации аутентификации покупателей

#### 3. **Theme Generator**
```bash
rails generate spree:storefront:theme [theme_name]
```

**Пример:**
```bash
rails generate spree:storefront:theme modern_animated_navbar
```

**Что создает:**
- Структуру папок для кастомной темы
- Базовые шаблоны и стили
- Конфигурацию темы

#### 4. **Authentication Generator**
```bash
rails generate spree:authentication:devise
```

**Назначение:** Настройка базовой аутентификации через Devise

### Последовательность установки:

```bash
# 1. Основная установка Spree
rails generate spree:install --user_class=User --install_admin=true --install_storefront=true

# 2. ОБЯЗАТЕЛЬНО: Создание storefront контроллеров аутентификации
rails generate spree:storefront:devise

# 3. Создание кастомной темы (если нужно)
rails generate spree:storefront:theme your_theme_name

# 4. Миграции и данные
rails db:migrate
rails db:seed

# 5. Тестовые данные (опционально)
bundle exec rake spree_sample:load
```

### Проверка установки:

```ruby
# В Rails console
puts "Spree.user_class: #{Spree.user_class}"           # => User
puts "Spree.admin_user_class: #{Spree.admin_user_class}" # => AdminUser
puts "Devise mappings: #{Devise.mappings.keys}"        # => [:user, :admin_user]

# Проверка пользователей
puts "Users: #{User.count}"
puts "AdminUsers: #{AdminUser.count}"
```

### Типичные проблемы:

❌ **`uninitialized constant Spree::UserSessionsController`**  
✅ **Решение:** `rails generate spree:storefront:devise`

❌ **Devise mappings пустые `[]`**  
✅ **Решение:** Отсутствуют storefront контроллеры аутентификации

❌ **Кнопка аккаунта не работает**  
✅ **Решение:** Запустить `spree:storefront:devise` генератор

### Можно ли запускать генераторы повторно?

✅ **Да, можно!** Генераторы Spree:
- Предупреждают о перезаписи существующих файлов
- Пропускают уже существующие маршруты
- Безопасно добавляют недостающие компоненты

**Рекомендация:** Всегда запускайте `spree:storefront:devise` после основной установки Spree для корректной работы аутентификации покупателей.

## 9. Команды для запуска

```bash
# 1. Добавить Spree
bundle add spree --version "~> 4.6"
bundle install

# 2. Установить Spree
rails generate spree:install --user_class=Spree::User

# 3. Создать админа
rails runner "Spree::User.create!(email: 'admin@example.com', password: 'password', admin: true)"

# 4. Запустить миграции
rails db:migrate

# 5. Наполнить тестовыми данными
rails runner "Spree::Sample.load_sample('all')"
```

---

**Статус:** План готов к реализации  
**Следующий шаг:** Создание ветки `spree-integration` и начало интеграции

```

Документ сохранен! Теперь у вас есть полный план интеграции Spree с микрофронтенд архитектурой. Этот подход позволит сохранить админку для клиентов и избежать конфликтов зависимостей с вашим современным фронтендом.

# Spree Integration Architecture: The "Spree Starter" Way

This document outlines the core architectural principles for integrating Spree into a custom Rails application, ensuring stability, maintainability, and adherence to Spree's conventions as demonstrated by the official `spree-starter` project.

## 1. Controller & Layout Philosophy

The central principle is that **Spree manages its own controllers and layouts**. The host Rails application should accommodate this, not override it.

### Controller Hierarchy

-   **`ApplicationController`:** This is your application's global base controller. **It should remain clean of Spree-specific logic and helpers.** It is for application-wide concerns (e.g., global authentication for non-Spree parts of the site).

-   **`Spree::BaseController` (from Gem):** The foundational controller for all of Spree, including the admin panel. It includes core helpers for authentication, store settings, locale, and currency.

-   **`Spree::StoreController` (from Gem):** This is the **most important controller for the storefront**. It inherits from `Spree::BaseController` and adds all logic required for the customer-facing shop:
    -   `include Spree::Core::ControllerHelpers::Order` (for cart management, `current_order`)
    -   `include Spree::ThemeConcern` (for theme management, `current_theme`)
    -   `include Spree::StorefrontHelper`
    -   And many others...

**Golden Rule:** Any controller that renders a storefront page (Homepage, Products, Cart, Checkout) **MUST** inherit from `Spree::StoreController`.

### Layouts

-   **`application.html.slim`:** Your global application layout. It should **NOT** be used for Spree storefront pages. It's for other parts of your application.

-   **`spree/storefront.html.erb` (from Gem):** The default layout for the entire Spree storefront. It correctly renders theme sections like the header and footer. All storefront pages use this layout automatically **if the controller inherits from `Spree::StoreController`**.

## 2. Authentication Architecture & Generators

Spree uses a dual authentication system via Devise, and relies on generators for setup.

-   **Storefront Users (`User`):** For customers. Managed by controllers in `app/controllers/spree/`.
-   **Admin Users (`AdminUser`):** For the backend. Managed by controllers in `spree/admin`.

### Critical Generator: `spree:storefront:devise`

This is the command that solves most authentication problems.

**Command:**
```bash
rails generate spree:storefront:devise
```

**What it does:**
1.  Creates the necessary Devise controllers for the storefront (`user_sessions_controller.rb`, etc.) in `app/controllers/spree/`.
2.  These controllers correctly `include Spree::Storefront::DeviseConcern`, which in turn includes all necessary helpers and sets the layout to `spree/storefront`.
3.  Adds the required Devise routes to `config/routes.rb`.

**Common Problem:** `uninitialized constant Spree::UserSessionsController`.
**Solution:** You forgot to run `rails generate spree:storefront:devise`.

## 3. The `spree.rb` Initializer

The file `config/initializers/spree.rb` is for configuration. The `Rails.application.config.to_prepare` block is powerful but should be used correctly.

-   **Incorrect Use:** Forcing `ApplicationController.include Spree::AuthenticationHelpers`. This was a "hack" to solve a problem caused by using the wrong layout. It breaks the architectural separation.
-   **Correct Use:** Loading decorators. This is the intended use, ensuring your custom logic is applied to Spree's core classes after they have been loaded. The `to_prepare` block ensures this happens reliably.

## 4. The Problem & The "Starter" Solution

-   **The Problem:** Our root route (`root "spree/home#index"`) correctly uses the gem's `Spree::HomeController`, but this controller ends up rendering its view within our `application.html.slim` layout instead of its own `spree/storefront` layout. This is the source of all our issues.

-   **The "Starter" Way:** In `spree-starter`, this "just works" because its `application.html.erb` is a minimal shell that does not interfere. To replicate this behavior correctly in our more complex app, we must explicitly tell Spree's controllers to use Spree's layouts.

-   **The Solution:** We must ensure that any Spree controller uses the `spree/storefront` layout. Since we want to modify the behavior of the gem's `Spree::HomeController` and other storefront controllers, the cleanest, most idiomatic Rails way to do this is with a **Decorator on `Spree::StoreController`**. We will not create a new controller; we will simply decorate the existing one to enforce the correct layout.
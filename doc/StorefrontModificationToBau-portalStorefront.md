# Spree Storefront Fork to Bau-portal Storefront

## 🎯 **ЦЕЛЬ ПРОЕКТА**

Создание собственного форка `spree_storefront` gem под названием `bau_portal_storefront` для упрощения архитектуры и устранения сложности патчинга через Vite.

## 🔍 **АНАЛИЗ ТЕКУЩЕЙ ПРОБЛЕМЫ**

### **Проблемы текущего "патч" подхода:**

1. **Сложная Vite конфигурация**: 30+ алиасов в `vite.config.ts` (строки 11-33)
2. **Система симлинков**: Хрупкая структура `app/frontend/spree/gem/`  
3. **Гибридная система сборки**: Vite + Sprockets одновременно
4. **Зависимость от структуры gem**: Каждое обновление Spree может сломать патчи
5. **Кошмар поддержки**: Сложность отладки и поддержки

### **Почему форк - правильное решение:**

1. ✅ **Core vs Storefront независимость**: Spree Core содержит бизнес-логику, Storefront только презентацию
2. ✅ **Админка отдельно**: Admin panel независим и работает со своей системой сборки  
3. ✅ **Чистая архитектура**: Одна система сборки (Vite) вместо гибридного подхода
4. ✅ **Полный контроль**: Версионирование изменений в storefront
5. ✅ **Простота поддержки**: Стандартный Rails + Vite без сложных патчей

## 🚀 **ПЛАН РЕАЛИЗАЦИИ**

### **Phase 1: Создание форка структуры** ⏳

#### 1.1 Fork Spree Storefront
```bash
# Клонировать оригинальный Spree
git clone https://github.com/spree/spree.git /tmp/spree-source

# Создать директорию для нового gem
mkdir -p /Users/vitaly/Development/spree-rails8-modern-fresh/vendor/gems/bau_portal_storefront

# Скопировать storefront
cp -r /tmp/spree-source/storefront/* /Users/vitaly/Development/spree-rails8-modern-fresh/vendor/gems/bau_portal_storefront/
```

#### 1.2 Переименование и настройка gem
```ruby
# bau_portal_storefront.gemspec
Gem::Specification.new do |gem|
  gem.name          = 'bau_portal_storefront'
  gem.version       = '1.0.0'  # Собственная версия
  gem.summary       = 'Modern Bau-portal Storefront based on Spree'
  gem.description   = 'Vite-enabled storefront for Bau-portal e-commerce'
  
  # Добавить Vite зависимость
  gem.add_dependency 'vite_rails', '~> 3.0'
  # Остальные зависимости из оригинального spree_storefront
end
```

#### 1.3 Обновить module namespaces
```ruby
# lib/bau_portal_storefront.rb
module BauPortalStorefront
  class Engine < Rails::Engine
    # Переименовать все Spree::Storefront ссылки
  end
end
```

### **Phase 2: Интеграция Vite внутри gem** ⏳

#### 2.1 Добавить Vite конфигурацию в gem
```typescript
// vendor/gems/bau_portal_storefront/vite.config.ts
import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'

export default defineConfig({
  plugins: [RubyPlugin()],
  build: {
    rollupOptions: {
      input: {
        storefront: './app/assets/javascripts/storefront.js',
        storefront_styles: './app/assets/stylesheets/storefront.css'
      }
    }
  }
})
```

#### 2.2 Перенести JavaScript assets в gem
```bash
# Скопировать все JavaScript файлы из симлинков
cp -r app/frontend/spree/gem/storefront_controllers/* \
  vendor/gems/bau_portal_storefront/app/assets/javascripts/controllers/

# Скопировать vendor libraries
cp -r app/frontend/spree/vendor_libraries.js \
  vendor/gems/bau_portal_storefront/app/assets/javascripts/
```

#### 2.3 Обновить layout файлы в gem
```erb
<!-- vendor/gems/bau_portal_storefront/app/views/spree/shared/_head.html.erb -->
<%= vite_client_tag %>
<%= vite_javascript_tag "storefront" %>
<%= vite_stylesheet_tag "storefront_styles" %>

<!-- Убрать все importmap и sprockets references -->
```

### **Phase 3: Упрощение основного приложения** ⏳

#### 3.1 Радикальное упрощение vite.config.ts
```typescript
// vite.config.ts - ПОСЛЕ форка
import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'

export default defineConfig({
  plugins: [RubyPlugin()],
  resolve: {
    // Убираем ВСЕ spree алиасы - теперь в gem!
    alias: {
      // Только наши собственные алиасы остаются
    }
  },
  build: {
    rollupOptions: {
      input: {
        application: './app/frontend/entrypoints/application.js',
        styles: './app/frontend/entrypoints/application.css'
        // Убираем spree entrypoint!
      }
    }
  }
})
```

#### 3.2 Очистка frontend структуры
```bash
# Удалить всю Spree патчинг структуру
rm -rf app/frontend/spree/
rm -rf app/frontend/entrypoints/spree.js

# Результат: чистая структура без Spree патчей
```

#### 3.3 Обновление Gemfile
```ruby
# Gemfile
# Убрать оригинальный spree_storefront
# gem 'spree_storefront', '~> 5.1.5'

# Добавить наш форк
gem 'bau_portal_storefront', path: './vendor/gems/bau_portal_storefront'
```

### **Phase 4: Тестирование и валидация** ⏳

#### 4.1 Тесты gem
```bash
cd vendor/gems/bau_portal_storefront
bundle exec rspec
```

#### 4.2 Интеграционные тесты
```bash
# В основном приложении
rails test:system
```

#### 4.3 Production тест
```bash
# Проверить сборку
bin/vite build
kamal deploy
```

## 📊 **СРАВНЕНИЕ ДО И ПОСЛЕ**

| Критерий | ДО (Патч подход) | ПОСЛЕ (Fork подход) |
|----------|-------------------|---------------------|
| **Vite конфигурация** | ❌ 65 строк, 30+ алиасов | ✅ 20 строк, простая |
| **Система сборки** | ❌ Vite + Sprockets | ✅ Чистый Vite |
| **Frontend структура** | ❌ app/frontend/spree/gem/ | ✅ Чистый app/frontend/ |
| **Зависимости** | ❌ Хрупкие симлинки | ✅ Стандартные gem |
| **Поддержка** | ❌ Сложная отладка | ✅ Простая разработка |
| **Обновления Spree** | ❌ Могут сломать патчи | ✅ Контролируемые |

## 🎯 **НЕМЕДЛЕННЫЕ ВЫГОДЫ**

1. **Устранение 90% сложности Vite конфигурации**
2. **Удаление системы симлинков** (папка `app/frontend/spree/gem/`)  
3. **Единая система сборки** (чистый Vite)
4. **Версионный контроль** изменений storefront
5. **Простая архитектура** без патчей

## 🚨 **РИСКИ И МИТИГАЦИЯ**

### **Риск 1: Потеря обновлений Spree Storefront**
**Митигация**: 
- Периодический мерж upstream изменений
- Мониторинг Spree changelog
- Селективное применение критических исправлений

### **Риск 2: Сложность поддержки собственного gem**
**Митигация**:
- Документирование всех изменений
- Автоматизированные тесты
- Четкая структура коммитов

### **Риск 3: Совместимость с Spree Core**
**Митигация**:
- Тесты интеграции с Core
- Следование Spree API соглашениям
- Регулярная проверка совместимости

## ⏰ **ВРЕМЕННЫЕ РАМКИ**

### **День 1-2: Phase 1-2** (Создание форка + Vite интеграция)
- [ ] Клонирование и настройка gem структуры
- [ ] Интеграция Vite в gem
- [ ] Перенос JavaScript assets

### **День 3: Phase 3** (Упрощение основного приложения)
- [ ] Очистка vite.config.ts  
- [ ] Удаление патчинг структуры
- [ ] Обновление зависимостей

### **День 4-5: Phase 4** (Тестирование)
- [ ] Unit тесты gem
- [ ] Интеграционные тесты
- [ ] Production развертывание

### **ИТОГО: 5 дней на полный переход**

## 🎉 **РЕЗУЛЬТАТ**

После реализации плана мы получим:

✅ **Чистую архитектуру**: Один build system (Vite) вместо гибрида  
✅ **Простую поддержку**: Стандартный gem development workflow  
✅ **Полный контроль**: Собственная версия storefront  
✅ **Решение CSS проблемы**: Единая система загрузки стилей  
✅ **Масштабируемость**: Простота добавления новых фич  

**Статус**: 🚀 Готов к реализации - план детализирован и протестирован conceptually.

## 📝 **СЛЕДУЮЩИЙ ШАГ**

**Master! Please don't forget to commit!** - зафиксировать план перед началом реализации.

После коммита планирования - запускаем Phase 1: создание форка.
 
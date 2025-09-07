# Spree Storefront Local Gem

Локальная копия spree_storefront gem'а для разработки.

## Статус

✅ **Работает**: Gem успешно заменяет оригинальный spree_storefront  
✅ **Storefront**: Главная страница загружается  
✅ **Админка**: Полностью работает  

## Изменения от оригинала

### Page Helper Fix
**Файл**: `app/helpers/spree/page_helper.rb`  
**Строки**: 101-103  
**Изменение**: Убраны `:rich_text_text` и `:rich_text_description` из section_includes

**Причина**: PageSections не поддерживают Action Text в spree_core 5.1.5, только PageBlocks.

**Ошибка была**:
```
Association named 'rich_text_text' was not found on Spree::PageSections::ImageWithText
```

## TODO

🚧 **РАЗОБРАТЬСЯ ПОЗЖЕ** с Page Helper:
- Понять, почему в оригинальном helper'е ожидается Action Text для sections
- Проверить, нужно ли добавлять `has_rich_text` в PageSections
- Возможно, это баг в spree_storefront v5.1.5

## Установка

```ruby
# Gemfile
gem 'spree_storefront', path: './vendor/gems/spree_storefront'
```

```bash
bundle install
bin/rails generate spree:storefront:install
bin/rails db:migrate
bin/rails db:seed
```

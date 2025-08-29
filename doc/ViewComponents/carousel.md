# Carousel ViewComponent

Базовый компонент карусели для отображения 3 слайдов с 3D позиционированием и автопрокруткой.

## Обзор

Carousel ViewComponent представляет собой изолированный компонент для отображения строго 3 слайдов в 3D пространстве с поддержкой автоматической прокрутки. Компонент организован по принципу "все в одной папке".

## Структура файлов

```markdown:spree-rails8-modern/doc/ViewComponents/carousel.md
<code_block_to_apply_changes_from>
app/components/carousel/
├── carousel_component.rb
├── carousel_component.html.slim  
├── carousel_component.css
└── carousel_component_controller.js
```

## Особенности

- ✅ **3D позиционирование**: Левый, центральный, правый слайд
- ✅ **Строго 3 слайда**: Компонент рассчитан только на 3 слайда
- ✅ **Автопрокрутка**: Автоматическая смена слайдов каждые 3 секунды
- ✅ **Умная пауза**: Остановка при наведении мыши и взаимодействии
- ✅ **Tailwind v4**: Стили через @layer components
- ✅ **Изолированные стили**: Уникальные CSS классы с ID компонента
- ✅ **ViewComponent архитектура**: Все файлы в одной папке

## Параметры

### `slides` (Array)
Массив из **строго 3 элементов** с данными слайдов:

| Ключ | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| `title` | String | ✅ | Заголовок слайда |
| `subtitle` | String | ✅ | Подзаголовок (автор, категория) |
| `image` | String | ✅ | URL изображения |
| `alt` | String | ❌ | Alt текст для изображения |

### `id` (String)
Уникальный идентификатор карусели. Если не указан, генерируется автоматически через `SecureRandom.hex(4)`.

### `autoplay` (Boolean, по умолчанию: true)
Включает/отключает автоматическую прокрутку слайдов.

### `autoplay_delay` (Integer, по умолчанию: 3000)
Задержка между автоматической сменой слайдов в миллисекундах.

## Использование

### Базовый пример с автопрокруткой

```slim
= render Carousel::CarouselComponent.new(
    slides: [
      {
        title: "Chairs & stools",
        subtitle: "by Tania Panas",
        image: "/images/chairs.jpg"
      },
      {
        title: "Home decore",
        subtitle: "by Sandra",
        image: "/images/interior.jpg"
      },
      {
        title: "Lamps & pendants",
        subtitle: "by Sandra",
        image: "/images/lamps.jpg"
      }
    ]
  )
```

### Пример без автопрокрутки

```slim
= render Carousel::CarouselComponent.new(
    slides: three_slides_data,
    autoplay: false
  )
```

### Пример с кастомной задержкой

```slim
= render Carousel::CarouselComponent.new(
    slides: three_slides_data,
    autoplay: true,
    autoplay_delay: 5000  # 5 секунд
  )
```

## Автопрокрутка

### Поведение
- ⏰ Автоматическая смена слайдов каждые 3 секунды (по умолчанию)
- ⏸️ Пауза при наведении мыши на карусель
- ▶️ Возобновление при убирании мыши
- 🛑 Временная остановка при ручной навигации (кнопки/точки)
- 🔄 Возобновление через 1 секунду после ручного взаимодействия

### Конфигурация

```ruby
# Отключить автопрокрутку
autoplay: false

# Изменить интервал на 5 секунд
autoplay_delay: 5000

# Быстрая прокрутка каждую секунду
autoplay_delay: 1000
```

## Позиционирование слайдов

```
[Слайд 1]     СЛАЙД 2      [Слайд 3]
  left        center         right
scale(0.8)   scale(1.0)    scale(0.8)
opacity: 70%  opacity: 100%  opacity: 70%
z-index: 1    z-index: 3     z-index: 1
```

## JavaScript API

### Основные методы

```javascript
// Управление автопрокруткой
this.startAutoplay()  // Запуск автопрокрутки
this.stopAutoplay()   // Остановка автопрокрутки

// Навигация
this.nextSlide()      // Следующий слайд
this.previousSlide()  // Предыдущий слайд
this.goToSlide(index) // Переход к слайду по индексу
```

### Stimulus values

- `id` - Уникальный ID карусели
- `currentSlide` - Текущий активный слайд (0-2)
- `totalSlides` - Общее количество слайдов
- `autoplay` - Включена ли автопрокрутка
- `autoplayDelay` - Задержка автопрокрутки в мс

### События

- `mouseenter` - Останавливает автопрокрутку
- `mouseleave` - Возобновляет автопрокрутку
- `click` (кнопки/точки) - Временно останавливает и возобновляет автопрокрутку

## Ограничения

⚠️ **Важно**: Компонент работает только с **3 слайдами**. При передаче другого количества слайдов поведение не определено.

---

**Версия**: 2.0.0 (с автопрокруткой)
**Поддержка**: 3 слайда с автоматической навигацией
**Новое**: Автопрокрут

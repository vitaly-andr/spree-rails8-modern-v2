# Chrome Stacking Context Issue

## Проблема

В проекте обнаружена проблема с отображением мобильного меню в браузере Chrome. Меню частично перекрывается элементами карусели, хотя имеет более высокий z-index.

### Браузеры с проблемой:
- ✗ Chrome (Desktop & Mobile)
- ✗ Chrome-based браузеры (Edge, Opera)

### Браузеры без проблемы:
- ✓ Safari
- ✓ Brave
- ✓ Firefox

## Техническая причина

Chrome более строго следует CSS спецификации по созданию **Stacking Context**. Элементы с определенными CSS свойствами создают изолированный контекст наложения:

1. `transform` (любые значения)
2. `opacity` (< 1.0, включая GSAP анимации)
3. `will-change`
4. `position: fixed/absolute` + z-index
5. `filter`, `backdrop-filter`
6. `contain: layout/style/paint`

## Проблемные элементы в проекте

### Карусель (`app/components/carousel/`)
```javascript
// Создает stacking context в Chrome:
gsap.to(this.element, {
  opacity: 1,          // ← Проблема!
  duration: 0.5
})

// И слайды с transform:
gsap.to(slide, {
  x: x,               // ← Проблема! 
  scale: scale,       // ← Проблема!
  zIndex: 3
})
```

### Мобильное меню
```slim
/ z-index игнорируется из-за stacking context карусели
.mobile-sidebar style="z-index: 101;"
```


## Полезные ссылки

- [MDN: CSS Stacking Context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)
- [CSS Tricks: Z-Index](https://css-tricks.com/almanac/properties/z/z-index/)
- [Chrome Bug Reports](https://bugs.chromium.org/p/chromium/issues/list?q=stacking%20context)

## Тестирование

Для проверки решения тестировать в:
1. Chrome Desktop (последняя версия)
2. Chrome Mobile (Android)
3. Safari (iOS/macOS)
4. Firefox

## Статус

- [ ] Проблема выявлена
- [ ] Решение выбрано
- [ ] Реализовано
- [ ] Протестировано во всех браузерах

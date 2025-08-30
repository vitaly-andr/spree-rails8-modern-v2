# Spree + Vite Integration Solution

## 🎯 Problem

Spree Commerce uses **Importmaps + Sprockets** for JavaScript management, while our project uses **Vite**. This creates a conflict where Spree JavaScript functionality doesn't work.

## 💡 Solution Overview

We've created a **hybrid system** that allows both Vite and Spree to coexist:

1. **Vite** manages main application assets (`application.js`)
2. **Separate Vite entrypoint** for Spree JavaScript (`spree.js`)
3. **Override Spree layouts** to use Vite instead of Importmaps
4. **Install Spree dependencies** via npm instead of vendor files

## 📁 Files Created/Modified

### New Files:
- `app/frontend/entrypoints/spree.js` - Spree JavaScript entrypoint
- `app/frontend/spree/vendor_libraries.js` - Spree vendor libraries
- `app/frontend/spree/storefront_controllers.js` - Spree Stimulus controllers
- `app/views/spree/shared/_head.html.erb` - Override Spree storefront head
- `app/views/spree/admin/shared/_head.html.erb` - Override Spree admin head

### Modified Files:
- `vite.config.ts` - Added Spree entrypoint
- `package.json` - Added Spree dependencies

## 🚀 Installation Steps

### 1. Install npm packages:
```bash
npm install
```

### 2. Start development server:
```bash
bin/dev
```

### 3. Test Spree functionality:
- Visit `/admin` for admin panel
- Visit Spree storefront routes
- Check browser console for JavaScript errors

## 📦 Added Dependencies

```json
{
  "@stimulus-components/carousel": "^5.0.0",
  "card-validator": "^10.0.0",
  "credit-card-type": "^10.0.1",
  "headroom.js": "^0.12.0",
  "nouislider": "^15.8.1",
  "photoswipe": "^5.4.4",
  "stimulus-read-more": "^4.1.0",
  "stimulus-scroll-to": "^5.1.0",
  "swiper": "^11.1.15"
}
```

## 🔧 How It Works

### 1. Vite Configuration
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    input: {
      application: './app/frontend/entrypoints/application.js',
      spree: './app/frontend/entrypoints/spree.js'  // ← New entrypoint
    }
  }
}
```

### 2. Spree Layout Override
```erb
<!-- app/views/spree/shared/_head.html.erb -->
<%# Replace Importmaps with Vite %>
<%= vite_client_tag %>
<%= vite_javascript_tag "spree" %>
```

### 3. JavaScript Architecture
```
app/frontend/
├── entrypoints/
│   ├── application.js    ← Main app JavaScript
│   └── spree.js         ← Spree JavaScript
└── spree/
    ├── vendor_libraries.js      ← Spree vendor libs
    └── storefront_controllers.js ← Spree controllers
```

## 🎮 Adding Spree Controllers

To add Spree Stimulus controllers, edit `app/frontend/spree/storefront_controllers.js`:

```javascript
// Example: Add cart controller
import CartController from './controllers/cart_controller.js'
controllers.push({ name: 'spree--cart', module: CartController })
```

## 🐛 Troubleshooting

### JavaScript not loading:
1. Check browser console for errors
2. Verify Vite dev server is running
3. Check that `vite_javascript_tag "spree"` is in layout

### Spree functionality broken:
1. Check if required npm packages are installed
2. Verify Stimulus controllers are registered
3. Check for missing vendor libraries

### CSS conflicts:
1. Spree uses its own CSS classes
2. May conflict with Tailwind CSS
3. Use CSS specificity or scoped styles

## 🔄 Future Improvements

1. **Automatic controller discovery** - Auto-import Spree controllers
2. **CSS integration** - Better Spree CSS + Tailwind integration  
3. **Hot reload** - Improve Vite HMR for Spree assets
4. **Testing** - Add tests for Spree JavaScript functionality

## 📚 References

- [Spree JavaScript Documentation](https://spreecommerce.org/docs/developer/storefront/custom-javascript)
- [Vite Ruby Documentation](https://vite-ruby.netlify.app/)
- [Stimulus Documentation](https://stimulus.hotwired.dev/)

# Testing Spree + Vite Integration

## 🧪 Quick Test Commands

### 1. Install dependencies and start server:
```bash
# Install npm packages
npm install

# Start development server
bin/dev
```

### 2. Test in browser:
```bash
# Open in browser
open http://localhost:5100
```

### 3. Check JavaScript loading:
Open browser console and look for:
- `🛒 Spree Commerce JavaScript loaded via Vite`
- `📚 Loading Spree vendor libraries...`
- `✅ Spree JavaScript initialization complete`

## 🔍 Manual Testing Checklist

### ✅ Basic Functionality:
- [ ] Main application loads without JavaScript errors
- [ ] Spree JavaScript entrypoint loads
- [ ] Stimulus controllers initialize
- [ ] No console errors related to missing dependencies

### ✅ Spree Admin (if accessible):
- [ ] Admin panel loads at `/admin`
- [ ] Admin JavaScript functionality works
- [ ] Forms and interactions work properly

### ✅ Spree Storefront (if configured):
- [ ] Storefront pages load
- [ ] Product pages work
- [ ] Cart functionality works
- [ ] Checkout process works

## 🚨 Common Issues & Solutions

### Issue: "Module not found" errors
**Solution:** Install missing npm packages:
```bash
npm install [missing-package]
```

### Issue: Stimulus controllers not working
**Solution:** Check controller registration in `spree/storefront_controllers.js`

### Issue: CSS conflicts
**Solution:** Spree CSS may conflict with Tailwind. Use scoped styles.

### Issue: Vite not serving Spree assets
**Solution:** Check `vite.config.ts` has correct entrypoints

## 📊 Success Indicators

### ✅ JavaScript Console:
```
🛒 Spree Commerce JavaScript loaded via Vite
📚 Loading Spree vendor libraries...
✅ Spree vendor libraries loaded
🎮 Loading Spree Storefront controllers...
✅ Loaded 0 Spree Storefront controllers
✅ Spree JavaScript initialization complete
```

### ✅ Network Tab:
- `spree.js` loads successfully
- No 404 errors for JavaScript assets
- Vite HMR works for both entrypoints

### ✅ Functionality:
- Spree forms work
- AJAX requests work
- Stimulus controllers respond to events
- No JavaScript errors in console

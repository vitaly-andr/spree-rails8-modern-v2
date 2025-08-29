# Spree Rails 8 Integration - Official Documentation Plan

## 🎯 Project Goal
Clean integration of Spree Commerce into Rails 8 project following official Spree documentation, then restore our custom navbar and theme functionality.

## 📋 Implementation Checklist

### Phase 1: Official Spree Integration

#### 🔧 Step 1.0: Prepare Assets and Vite Configuration
- [x] Copy complete assets structure from working project:
```bash
# Copy assets structure
cp -r /Users/vitaly/Development/spree-rails8-modern/app/assets/config ./app/assets/
cp -r /Users/vitaly/Development/spree-rails8-modern/app/assets/builds ./app/assets/
cp -r /Users/vitaly/Development/spree-rails8-modern/app/assets/stylesheets ./app/assets/

# Copy Vite configuration
cp /Users/vitaly/Development/spree-rails8-modern/vite.config.ts ./
```
- [x] Ensure `app/assets/config/manifest.js` is configured correctly:
```javascript
// app/assets/config/manifest.js
//= link_tree ../images
//= link_directory ../stylesheets .css  

// Только Admin манифест (он уже включает core)
//= link spree_admin_manifest

//= link_tree ../builds
```
- [x] Ensure `vite.config.ts` is configured for Rails integration:
```typescript
import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'

export default defineConfig({
  plugins: [
    RubyPlugin(),
  ],
  build: {
    rollupOptions: {
      input: {
        application: './app/javascript/application.js',
        spree_storefront: './app/javascript/spree_storefront.js'
      }
    }
  },
  server: {
    watch: {
      ignored: [
        '**/doc/**',      // игнорировать документацию
        '**/tmp/**',
        '**/log/**',
        '**/node_modules/**',
        '**/public/**',
        '**/storage/**',
        '**/*.md',        // игнорировать markdown
      ],
    },
    host: 'localhost', // <--- важно!
    port: 3036,
    hmr: {
      host: 'localhost', // <--- важно!
      port: 3036,
    },
  },
})
```
- **Important**: 
  - NO `//= link_directory ../javascripts .js` line in manifest.js (causes Sprockets errors with Vite)
  - Vite config uses `app/javascript/` paths (not `app/frontend/entrypoints/`)
- **Test**: Assets and Vite configuration ready for Spree ✅
- **Commit**: `feat(assets): Copy working assets structure, Vite config and configure manifest.js for Spree integration` ✅

#### 🔧 Step 1.1: Add Spree Gems to Gemfile
- [x] Add Spree gems following [official documentation](https://spreecommerce.org/docs/developer/advanced/adding_spree_to_rails_app)
- [x] Use latest stable versions from GitHub main branch
- [x] Include all necessary gems: core, admin, storefront, emails, sample
```ruby
# Add to Gemfile:
spree_opts = { 'github': 'spree/spree', 'branch': 'main' }
gem 'spree', spree_opts # core and API
gem 'spree_admin', spree_opts # Admin panel (optional)
gem 'spree_storefront', spree_opts # Storefront (optional)
gem 'spree_emails', spree_opts # transactional emails (optional)
gem 'spree_sample', spree_opts # dummy data like products, taxons, etc (optional)
```
- **Test**: `bundle install` completes successfully ✅
- **Commit**: `feat(spree): Add Spree gems following official documentation` ✅

#### 🔧 Step 1.2: Fix Spree Generator Template (CRITICAL!)
- [x] **IMPORTANT**: Before running generators, fix the template in gem:
  - File: `/Users/vitaly/.rvm/gems/ruby-3.4.1/gems/spree_core-5.1.5/lib/generators/spree/install/templates/config/initializers/spree.rb`
  - Line 90: Uncomment `Spree.admin_user_class = 'Spree::AdminUser'`
- **Why**: Generator template has admin_user_class commented out by default
- **Test**: Template shows uncommented admin_user_class line ✅

#### 🔧 Step 1.3: Initialize Devise
- [x] Initialize Devise configuration
```bash
rails generate devise:install
```
- **Test**: Devise initializer and locales created ✅
- **Commit**: `feat(auth): Initialize Devise configuration` ✅

#### 🔧 Step 1.4: Create User Models with Devise
- [x] Create AdminUser model with Spree namespace: `rails generate devise Spree::AdminUser`
- [x] Create User model with Spree namespace: `rails generate devise Spree::User`  
- [x] Run migrations: `rails db:migrate`
- **Test**: User tables created with proper Spree namespacing ✅
- **Commit**: `feat(auth): Create Spree::User and Spree::AdminUser models with Devise` ✅

#### 🔧 Step 1.5: Run Official Spree Install Generator
- [x] Execute official Spree install generator with proper parameters
- [x] Use `Spree::User` class for proper Spree integration
- [x] Enable both admin and storefront
- [x] Use Devise for authentication
```bash
bin/rails g spree:install --user_class=Spree::User --install_admin=true --install_storefront=true --authentication=devise --admin_email=vitaly.andr@gmail.com --admin_password=Prime3432! --auto_accept --enforce_available_locales=true
```
- **Generator Options Explained**:
  - `--user_class=Spree::User`: Use Spree::User model (proper Spree integration)
  - `--install_admin=true`: Install Admin Panel
  - `--install_storefront=true`: Install Storefront
  - `--authentication=devise`: Use Devise for authentication
  - `--admin_email`: Set admin user email
  - `--admin_password`: Set admin user password
  - `--auto_accept`: Auto-accept prompts
  - `--enforce_available_locales=true`: Enforce locale validation
- **Test**: Generator completes without errors ✅
- **Commit**: `feat(spree): Run official Spree install generator with Spree::User model integration` ✅

#### 🔧 Step 1.6: Add Internationalization Support
- [x] Add `spree_i18n` gem to Gemfile for Russian localization
- [x] Run `bundle install` to install spree_i18n
- [x] **Note**: `spree_i18n:install` generator is empty - gem works automatically via Rails Engine
- [x] Gem automatically loads translations for `config.i18n.available_locales`
- **Test**: I18n support installed correctly ✅
- **Commit**: `feat(i18n): Add spree_i18n for Russian localization support` ✅

#### 🔧 Step 1.7: Add Sample Data (Optional)
- [ ] Load sample products, categories, and checkout flow
```bash
bin/rake spree_sample:load
```
- **Test**: Sample data loads successfully ⏳
- **Commit**: `feat(spree): Add sample data for development and testing` ⏳

### Phase 2: Verify Spree Installation

#### ✅ Step 2.1: Test Admin Dashboard
- [x] Start Rails server: `bin/dev`
- [x] Navigate to: http://localhost:5100/admin
- [x] Login with configured credentials:
  - Email: `vitaly.andr@gmail.com`
  - Password: `Prime3432!`
- [ ] Verify admin dashboard loads correctly
- [ ] Check basic admin functionality (products, orders, users)
- **Test**: Admin dashboard fully functional ⏳
- **Commit**: `test(spree): Verify admin dashboard functionality` ⏳

#### ✅ Step 2.2: Test Storefront
- [x] Navigate to: http://localhost:5100
- [x] Verify storefront loads with Spree default theme
- [ ] Test basic storefront functionality:
  - Product browsing
  - Add to cart
  - User registration/login
  - Checkout flow (if sample data loaded)
- **Test**: Storefront fully functional ⏳
- **Commit**: `test(spree): Verify storefront functionality and user flows` ⏳

#### ✅ Step 2.3: Verify Authentication Integration
- [ ] Test Spree::User model integration with Spree
- [ ] Verify Devise authentication works
- [ ] Check that users can register/login on storefront
- [ ] Verify admin users can access admin panel
- **Test**: Authentication flows work correctly ⏳
- **Commit**: `test(auth): Verify Spree::User model and Devise integration with Spree` ⏳

## 🚨 Critical Installation Order (MUST FOLLOW EXACTLY!)

### Correct Sequence:
1. **Copy assets structure AND vite.config.ts** from working project ✅
2. **Add Spree gems** → `bundle install` ✅
3. **Fix gem template** (uncomment admin_user_class in spree_core gem) ✅
4. **Initialize Devise** → `rails generate devise:install` ✅
5. **Create User models** → `rails generate devise Spree::AdminUser` + `rails generate devise Spree::User` ✅
6. **Run migrations** → `rails db:migrate` ✅
7. **Run Spree installer** → `bin/rails g spree:install --user_class=Spree::User ...` ✅

### Assets & Vite Configuration Requirements:
- ✅ **DO** copy complete `app/assets/` structure from working project
- ✅ **DO** copy `vite.config.ts` from working project
- ✅ **DO** ensure `manifest.js` excludes `javascripts` directory
- ✅ **DO** include `builds/` directory for Vite output
- ✅ **DO** include `spree_admin_manifest` in manifest.js
- ✅ **DO** use `app/javascript/` paths in vite.config.ts (not `app/frontend/entrypoints/`)
- ❌ **DON'T** use `link_directory ../javascripts .js` (causes errors)

### Common Pitfalls Avoided:
- ❌ **DON'T** create `User` model without Spree namespace
- ❌ **DON'T** run `spree:install` before creating Devise models
- ❌ **DON'T** forget to fix gem template before installation
- ❌ **DON'T** skip copying assets structure and Vite config from working project
- ❌ **DON'T** use wrong paths in vite.config.ts
- ✅ **DO** use `Spree::User` and `Spree::AdminUser` for proper integration
- ✅ **DO** fix template in gem before running generators
- ✅ **DO** follow exact installation order

### Phase 3: Restore Custom Functionality

#### 🔄 Step 3.1: Restore Navbar Component
- [ ] Copy navbar components from old project:
  - `app/components/navbar/` (if using ViewComponents)
  - `app/views/shared/_navbar.html.erb` (if using partials)
- [ ] Update navbar to work with Spree authentication
- [ ] Test navbar functionality with Spree routes
- **Test**: Navbar displays and functions correctly ⏳
- **Commit**: `feat(ui): Restore custom navbar component with Spree integration` ⏳

#### 🔄 Step 3.2: Restore Theme and Styling
- [ ] Copy theme files from old project:
  - CSS/SCSS files
  - JavaScript files
  - Image assets
- [ ] Update theme to work with Spree storefront
- [ ] Ensure theme doesn't conflict with Spree admin
- **Test**: Theme applies correctly without breaking Spree ⏳
- **Commit**: `feat(ui): Restore custom theme and styling` ⏳

#### 🔄 Step 3.3: Restore Custom Components
- [ ] Copy other custom components from old project
- [ ] Update components to work with Spree data models
- [ ] Test component functionality
- **Test**: All custom components work correctly ⏳
- **Commit**: `feat(ui): Restore custom components with Spree integration` ⏳

### Phase 4: Final Integration and Testing

#### 🧪 Step 4.1: Integration Testing
- [ ] Test complete user journey from storefront to checkout
- [ ] Test admin functionality with custom components
- [ ] Verify all authentication flows work
- [ ] Test responsive design on mobile/desktop
- **Test**: Full application works seamlessly ⏳
- **Commit**: `test(integration): Complete end-to-end testing` ⏳

#### 📚 Step 4.2: Documentation Update
- [ ] Update README with new Spree integration
- [ ] Document any custom modifications made
- [ ] Create deployment guide if needed
- **Test**: Documentation is complete and accurate ⏳
- **Commit**: `docs: Update documentation for Spree integration` ⏳

## 📖 References
- [Official Spree Documentation](https://spreecommerce.org/docs/developer/advanced/adding_spree_to_rails_app)
- [Spree GitHub Repository](https://github.com/spree/spree)
- [Devise Documentation](https://github.com/heartcombo/devise)

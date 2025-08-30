# Spree Rails 8 Integration - Official Documentation Plan

## 🎯 Project Goal
Clean integration of Spree Commerce into Rails 8 project following official Spree documentation, then restore our custom navbar and theme functionality.

## 📋 Implementation Checklist

### Phase 1: Official Spree Integration

#### 🔧 Step 1.0: Prepare Assets Configuration
- [x] Copy complete assets structure from working project:
```bash
# Copy from /Users/vitaly/Development/spree-rails8-modern/app/assets/
cp -r /Users/vitaly/Development/spree-rails8-modern/app/assets/config ./app/assets/
cp -r /Users/vitaly/Development/spree-rails8-modern/app/assets/builds ./app/assets/
cp -r /Users/vitaly/Development/spree-rails8-modern/app/assets/stylesheets ./app/assets/
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
- **Important**: NO `//= link_directory ../javascripts .js` line (causes Sprockets errors with Vite)
- **Test**: Assets configuration ready for Spree ✅
- **Commit**: `feat(assets): Copy working assets structure and configure manifest.js for Spree and Vite integration` ✅

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
  1. **Find actual gem path**: `bundle show spree_core`
  2. **Navigate to template**: `<gem_path>/lib/generators/spree/install/templates/config/initializers/spree.rb`
  3. **Fix line 90**: Change `# Spree.admin_user_class = 'AdminUser'` to `Spree.admin_user_class = 'Spree::AdminUser'`

```bash
# Step 1: Find actual gem path
SPREE_PATH=$(bundle show spree_core)
echo "Spree core gem path: $SPREE_PATH"

# Step 2: Edit the template file
# File: $SPREE_PATH/lib/generators/spree/install/templates/config/initializers/spree.rb
# Line 90: Change from:
#   # Spree.admin_user_class = 'AdminUser'
# To:
#   Spree.admin_user_class = 'Spree::AdminUser'
```

- **Why**: Generator template has admin_user_class commented out by default
- **Important**: Bundle may use gem from `bundler/gems/` (GitHub) not `gems/` (rubygems.org)
- **Test**: Template shows uncommented admin_user_class line with correct namespace ✅

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
bin/rails g spree:install --user_class=Spree::User --install_admin=true --install_storefront=true --authentication=devise --auto_accept --enforce_available_locales=true
```
- **Generator Options Explained**:
  - `--user_class=Spree::User`: Use Spree::User model (proper Spree integration)
  - `--install_admin=true`: Install Admin Panel
  - `--install_storefront=true`: Install Storefront
  - `--authentication=devise`: Use Devise for authentication
  - `--auto_accept`: Auto-accept prompts
  - `--enforce_available_locales=true`: Enforce locale validation
- **IMPORTANT**: `--admin_email` and `--admin_password` options are **ignored** by the seed. Default admin user will be created.
- **Test**: Generator completes without errors ✅
- **Commit**: `feat(spree): Run official Spree install generator with Spree::User model integration` ✅

#### 🔧 Step 1.6: Fix Devise Routes (CRITICAL!)
- [x] **IMPORTANT**: After installation, generators might add incorrect routes. Clean up `config/routes.rb`:
  1.  **Remove duplicate** `devise_for` calls at the end of the file.
  2.  **Ensure correct admin routes** are at the top, outside the `Spree::Core::Engine.add_routes` block.
- **Correct `config/routes.rb` Structure**:
```ruby
Rails.application.routes.draw do
  # Admin authentication
  devise_for :admin_users,
    class_name: "Spree::AdminUser",
    controllers: {
      sessions: "spree/admin/user_sessions",
      passwords: "spree/admin/user_passwords"
    },
    skip: :registrations,
    path: :admin_users

  # This line mounts Spree's routes at the root of your application.
  mount Spree::Core::Engine, at: "/"

  Spree::Core::Engine.add_routes do
    # Storefront routes
    scope "(:locale)", locale: /#{Spree.available_locales.join('|')}/, defaults: { locale: nil } do
      devise_for(
        Spree.user_class.model_name.singular_route_key,
        # ... (storefront devise config)
      )
    end
  end
  # ... (other app routes)
end
```
- **Test**: Admin panel accessible at `/admin` and redirects to `/admin_users/sign_in` ✅
- **Commit**: `fix(routes): correct devise routes for admin panel` ✅

#### 🔧 Step 1.7: Add Internationalization Support
- [x] Add `spree_i18n` gem to Gemfile for Russian localization
- [x] Run `bundle install` to install spree_i18n
- [x] **Note**: `spree_i18n:install` generator is empty - gem works automatically via Rails Engine
- [x] Gem automatically loads translations for `config.i18n.available_locales`
- **Test**: I18n support installed correctly ✅
- **Commit**: `feat(i18n): Add spree_i18n for Russian localization support` ✅

#### 🔧 Step 1.8: Configure Vite Integration with Spree JavaScript (NEW!)
- [x] **Problem**: Spree controllers use JavaScript dependencies that need to be available in Vite
- [x] **Solution**: Create symlink-based integration to use Spree gem JavaScript files directly

##### Sub-step 1.8.1: Create Spree Gem Path Helper
- [x] Create `lib/spree_gem_path.rb` to dynamically find Spree gem location:
```ruby
# lib/spree_gem_path.rb
require "bundler"

def spree_gem_path
  spec = Bundler.load.specs.find { |s| s.name == "spree" }
  return spec.full_gem_path if spec

  # Fallback: try to find spree_core
  spec = Bundler.load.specs.find { |s| s.name == "spree_core" }
  return File.dirname(spec.full_gem_path) if spec

  raise "Spree gem not found in bundle"
end
```

##### Sub-step 1.8.2: Create Symlink Setup Rake Task
- [x] Create `lib/tasks/spree_symlinks.rake` for automated symlink creation:
```ruby
# lib/tasks/spree_symlinks.rake
namespace :spree do
  desc "Create symlinks to Spree gem JavaScript files"
  task :setup_symlinks do
    # Creates symlinks for:
    # - storefront_controllers → Spree storefront controllers
    # - core_controllers → Spree core controllers  
    # - core_helpers → Spree core helpers
    # - tailwindcss-stimulus-components.js → Custom Spree version
  end
end
```

##### Sub-step 1.8.3: Configure Vite Aliases
- [x] Update `vite.config.ts` to resolve Spree JavaScript through symlinks:
```typescript
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      'spree/storefront/controllers': resolve(__dirname, './app/frontend/spree/gem/storefront_controllers'),
      'spree/core/controllers': resolve(__dirname, './app/frontend/spree/gem/core_controllers'),
      'spree/core/helpers': resolve(__dirname, './app/frontend/spree/gem/core_helpers'),
      'tailwindcss-stimulus-components': resolve(__dirname, './app/frontend/spree/gem/tailwindcss-stimulus-components.js'),
    }
  }
})
```

##### Sub-step 1.8.4: Add Required NPM Dependencies
- [x] Add Spree JavaScript dependencies to `package.json`:
```json
{
  "dependencies": {
    "@rails/request.js": "^0.0.12",
    "@stimulus-components/carousel": "^6.0.0", 
    "@kanety/stimulus-accordion": "^1.2.0"
  }
}
```

##### Sub-step 1.8.5: Create Vendor Libraries Loader
- [x] Update `app/frontend/spree/vendor_libraries.js` to load all Spree dependencies:
```javascript
// Load Rails request library globally for Spree controllers
import '@rails/request.js'
import '@kanety/stimulus-accordion'
// ... other Spree dependencies
```

##### Sub-step 1.8.6: Setup Automated Symlink Creation
- [x] Add npm script for symlink setup: `"setup-spree": "bundle exec rake spree:setup_symlinks"`
- [x] Run symlink creation: `bundle exec rake spree:setup_symlinks`
- [x] Verify symlinks created in `app/frontend/spree/gem/`:
  - `storefront_controllers/` → Spree storefront controllers
  - `core_controllers/` → Spree core controllers
  - `core_helpers/` → Spree core helpers  
  - `tailwindcss-stimulus-components.js` → Custom Spree version

- **Result**: Spree JavaScript controllers now load successfully in Vite! ✅
- **Test**: No more "Failed to resolve import" errors for Spree controllers ✅
- **Commit**: `feat(spree): implement symlink-based integration for Spree controllers` ✅

#### 🔧 Step 1.9: Add Sample Data (Optional)
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
- [x] Login with **default** credentials (options in generator are ignored):
  - Email: `spree@example.com`
  - Password: `spree123`
- [x] Verify admin dashboard loads correctly ✅
- [x] Change default password after first login
- **Test**: Admin dashboard fully functional ✅
- **Commit**: `test(spree): Verify admin dashboard functionality` ✅

#### ✅ Step 2.2: Test Storefront
- [x] Navigate to: http://localhost:5100
- [x] Verify storefront loads with Spree default theme ✅
- [x] Test basic storefront functionality:
  - Product browsing ✅
  - Add to cart ✅
  - User registration/login ✅
  - Checkout flow (if sample data loaded) ⏳
- **Test**: Storefront fully functional ✅
- **Commit**: `test(spree): Verify storefront functionality and user flows` ✅

#### ✅ Step 2.3: Verify Authentication Integration
- [x] Test Spree::User model integration with Spree ✅
- [x] Verify Devise authentication works ✅
- [x] Check that users can register/login on storefront ✅
- [x] Verify admin users can access admin panel ✅
- **Test**: Authentication flows work correctly ✅
- **Commit**: `test(auth): Verify Spree::User model and Devise integration with Spree` ✅

#### ✅ Step 2.4: Verify Vite + Spree JavaScript Integration
- [x] Test that Spree storefront controllers load without errors ✅
- [x] Verify Stimulus controllers from Spree gem work correctly ✅
- [x] Check that all JavaScript dependencies resolve properly ✅
- [x] Confirm no "Failed to resolve import" errors in browser console ✅
- **Test**: Vite successfully integrates with Spree JavaScript ✅
- **Commit**: `test(js): Verify Vite integration with Spree JavaScript controllers` ✅

## 🚨 Critical Installation Order (MUST FOLLOW EXACTLY!)

### Correct Sequence:
1. **Copy assets structure** from working project ✅
2. **Add Spree gems** → `bundle install` ✅
3. **Fix gem template** (uncomment admin_user_class in spree_core gem) ✅
4. **Initialize Devise** → `rails generate devise:install` ✅
5. **Create User models** → `rails generate devise Spree::AdminUser` + `rails generate devise Spree::User` ✅
6. **Run migrations** → `rails db:migrate` ✅
7. **Run Spree installer** → `bin/rails g spree:install --user_class=Spree::User ...` ✅
8. **Fix Devise Routes** → Manually edit `config/routes.rb` ✅
9. **Setup Vite Integration** → Create symlinks and configure aliases ✅

### Vite Integration Requirements:
- ✅ **DO** create symlinks to Spree gem JavaScript files
- ✅ **DO** configure Vite aliases for Spree controllers/helpers
- ✅ **DO** add required NPM dependencies for Spree controllers
- ✅ **DO** load Spree dependencies globally in vendor_libraries.js
- ✅ **DO** use automated rake task for symlink creation
- ❌ **DON'T** try to copy Spree JavaScript files manually
- ❌ **DON'T** modify Spree gem files directly

### Assets Structure Requirements:
- ✅ **DO** copy complete `app/assets/` structure from working project
- ✅ **DO** ensure `manifest.js` excludes `javascripts` directory
- ✅ **DO** include `builds/` directory for Vite output
- ✅ **DO** include `spree_admin_manifest` in manifest.js
- ❌ **DON'T** use `link_directory ../javascripts .js` (causes errors)

### Common Pitfalls Avoided:
- ❌ **DON'T** create `User` model without Spree namespace
- ❌ **DON'T** run `spree:install` before creating Devise models
- ❌ **DON'T** forget to fix gem template before installation
- ❌ **DON'T** skip copying assets structure from working project
- ❌ **DON'T** leave incorrect routes generated by Devise
- ❌ **DON'T** try to use Spree JavaScript without proper Vite integration
- ✅ **DO** use `Spree::User` and `Spree::AdminUser` for proper integration
- ✅ **DO** fix template in gem before running generators
- ✅ **DO** follow exact installation order
- ✅ **DO** setup symlink-based Vite integration for Spree JavaScript

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

## 🎉 SUCCESS METRICS

### ✅ Phase 1 & 2 Complete!
- **Spree Installation**: 100% Complete ✅
- **Admin Dashboard**: Fully functional ✅
- **Storefront**: Fully functional ✅
- **Authentication**: Working correctly ✅
- **Vite Integration**: Successfully implemented ✅
- **JavaScript Controllers**: All loading without errors ✅

### 🚀 Key Achievements:
1. **Clean Spree Integration**: Following official documentation exactly
2. **Proper Namespacing**: Using `Spree::User` and `Spree::AdminUser` models
3. **Vite Compatibility**: Innovative symlink-based approach for Spree JavaScript
4. **Zero Conflicts**: Spree works alongside existing Rails 8 + Vite setup
5. **Automated Setup**: Rake task for easy symlink management

## 📖 References
- [Official Spree Documentation](https://spreecommerce.org/docs/developer/advanced/adding_spree_to_rails_app)
- [Spree GitHub Repository](https://github.com/spree/spree)
- [Devise Documentation](https://github.com/heartcombo/devise)
- [Vite Ruby Documentation](https://vite-ruby.netlify.app/)

# Spree Architecture Modernization - Complete Implementation Plan

## 🎯 Project Goal
Complete modernization of Spree integration: fix authentication forms to use Spree storefront views instead of standard Devise, convert ERB layouts to Slim with Vite integration, and ensure proper controller hierarchy.

## 📋 Implementation Checklist

### Phase 1: Authentication Forms Fix (CRITICAL)

#### 🔧 Step 1.1: Fix Authentication Routes and Controllers
- [ ] **Current Issue**: Authentication forms use standard Devise views instead of Spree storefront views
- [ ] Verify `spree_login_path` routes to correct Spree storefront controller
- [ ] Ensure `Spree::UserSessionsController` includes `Spree::Storefront::DeviseConcern`
- [ ] **Principle**: Use Spree's beautiful storefront authentication forms, not standard Devise
- **Test**: Login form opens in slideover with Spree storefront styling ⏳
- **Commit**: `fix(auth): Ensure authentication uses Spree storefront views` ⏳

#### 🔧 Step 1.2: Verify Spree Storefront Authentication Views
- [ ] Check that Spree gem provides: `devise/sessions/new.html.erb` with `turbo_frame_tag :login`
- [ ] Verify Spree gem provides: `devise/registrations/new.html.erb`
- [ ] Verify Spree gem provides: `devise/passwords/new.html.erb`
- [ ] **These should work automatically** with proper controller setup
- **Test**: All authentication forms render with Spree storefront styling ⏳
- **Commit**: `test(auth): Verify Spree storefront authentication views work` ⏳

#### 🔧 Step 1.3: Fix Custom Controllers Inheritance
- [ ] Update `SpreePagesController` to properly inherit from `Spree::StoreController`
- [ ] Remove `layout "application"` override from SpreePagesController
- [ ] Ensure access to `current_store`, `current_theme`, etc. through proper inheritance
- **Test**: Custom Spree pages render with proper theme ⏳
- **Commit**: `fix(controllers): Update SpreePagesController to inherit from Spree::StoreController` ⏳

### Phase 2: Spree.rb Initializer Verification

#### 🔧 Step 2.1: Keep Spree Helpers Integration
- [ ] **KEEP**: `ApplicationController.include Spree::AuthenticationHelpers` in initializer
- [ ] **Principle**: All Spree helpers should remain accessible everywhere
- [ ] Verify decorator loading works correctly
- [ ] Preserve theme registration and user class configuration
- **Test**: All Spree helpers work correctly throughout application ⏳
- **Commit**: `test(config): Verify Spree helpers integration works correctly` ⏳

#### 🔧 Step 2.2: Verify Authentication Setup
- [ ] Ensure `Spree.user_class = "User"` and `Spree.admin_user_class = "AdminUser"`
- [ ] Verify Devise parent controller: `Devise.parent_controller = "Spree::BaseController"`
- [ ] Test authentication controllers work correctly
- [ ] Validate dual authentication system (User/AdminUser)
- **Test**: Authentication flows work for both storefront and admin ⏳
- **Commit**: `test(auth): Verify authentication setup works correctly` ⏳

### Phase 3: Layout Modernization (Slim + Vite) - CRITICAL STYLING devPRESERVATION

#### 🔄 Step 3.1: Modernize Head Partial (CRITICAL)
- [ ] Backup: `app/views/spree/shared/_head.html.erb` → `_head_old.html.erb`
- [ ] Create: `app/views/spree/shared/_head.html.slim`
- [ ] Convert ERB to Slim while **EXACTLY** preserving:
  - All Vite client and JavaScript tags
  - All stylesheet links with defer attributes
  - All cache blocks and conditionals
  - All CSS inline styles for test environment
  - **ALL original styling and functionality**
- [ ] **CRITICAL**: Maintain exact Vite integration functionality
- [ ] **CRITICAL**: Ensure all Spree helpers work in Slim format
- **Test**: Storefront loads with identical styling and functionality ⏳
- **Commit**: `feat(layout): Convert Spree head partial from ERB to Slim preserving all functionality` ⏳

#### 🔄 Step 3.2: Modernize Account Pane
- [ ] Backup: `_account_pane.html.erb` → `_account_pane_old.html.erb`
- [ ] Create: `_account_pane.html.slim`
- [ ] Convert ERB to Slim while preserving:
  - `turbo_frame_tag "login", src: spree_login_path` functionality
  - Slideover functionality and styling
  - All Spree authentication helper integrations
- [ ] **CRITICAL**: Maintain exact styling and functionality
- **Test**: Account pane works identically with Spree authentication forms ⏳
- **Commit**: `feat(theme): Convert account pane from ERB to Slim preserving functionality` ⏳

#### 🔄 Step 3.3: Modernize Other Theme Templates
- [ ] Backup and convert: `_rich_text.html.erb` → `_rich_text.html.slim`
- [ ] Backup and convert: `_product_details.html.erb` → `_product_details.html.slim`
- [ ] Convert: `account/addresses/index.html.erb` → `index.html.slim`
- [ ] **CRITICAL**: Preserve all Spree helper integrations and functionality
- [ ] **CRITICAL**: Maintain exact styling
- **Test**: All theme templates render identically with Slim ⏳
- **Commit**: `feat(theme): Convert remaining theme templates to Slim` ⏳

### Phase 4: Layout Architecture Verification

#### ✅ Step 4.1: Verify Layout Hierarchy
- [ ] **Verify**: `application.html.slim` used only for non-Spree pages
- [ ] **Verify**: `spree/storefront.html.slim` used for all storefront pages
- [ ] **Verify**: Theme sections render correctly in storefront layout
- [ ] **Test**: Root route (`spree/home#index`) uses `spree/storefront` layout
- **Test**: Layout separation works as designed ⏳
- **Commit**: `test(layout): Verify proper layout hierarchy and separation` ⏳

#### ✅ Step 4.2: Vite Integration Verification
- [ ] Test Vite client tag functionality in Slim templates
- [ ] Verify JavaScript entrypoints load correctly:
  - `application` entrypoint
  - `spree_storefront` entrypoint
- [ ] Check stylesheet loading with defer attributes
- [ ] Validate HMR (Hot Module Replacement) works
- [ ] **CRITICAL**: Verify all Spree helpers work in Slim templates
- **Test**: All Vite functionality preserved after Slim conversion ⏳
- **Commit**: `test(vite): Verify Vite integration and Spree helpers after Slim conversion` ⏳

### Phase 5: Testing and Documentation

#### 🧪 Step 5.1: Comprehensive Architecture Testing
- [ ] Test controller inheritance hierarchy
- [ ] Verify layout selection logic
- [ ] Test authentication flows (User/AdminUser) with Spree storefront forms
- [ ] Validate theme functionality
- [ ] Test mobile menu and responsive behavior
- [ ] **CRITICAL**: Test all Spree helpers accessibility in Slim templates
- **Test**: Complete architecture works as designed ⏳
- **Commit**: `test: Add comprehensive architecture integration tests` ⏳

#### 📚 Step 5.2: Update Documentation
- [ ] Update architecture documentation
- [ ] Document authentication flow with Spree storefront views
- [ ] Create rollback instructions for each phase
- [ ] Update development workflow docs
- **Test**: Documentation is complete and accurate ⏳
- **Commit**: `docs: Update documentation for modernized Spree architecture` ⏳

## 🏗️ Architectural Principles

### Authentication Flow
1. **Account button** → triggers `slideover-account#toggle`
2. **Account pane** → loads `turbo_frame_tag "login", src: spree_login_path`
3. **spree_login_path** → routes to `Spree::UserSessionsController`
4. **Controller** → includes `Spree::Storefront::DeviseConcern`
5. **View** → renders Spree's beautiful `devise/sessions/new.html.erb` with `turbo_frame_tag :login`

### Controller Hierarchy
1. **`ApplicationController`**: Clean but Spree helpers remain accessible
2. **`Spree::BaseController`**: Foundation for all Spree (admin + storefront)
3. **`Spree::StoreController`**: **CRITICAL** - All storefront controllers must inherit from this

### Layout Separation
1. **`application.html.slim`**: For non-Spree pages only
2. **`spree/storefront.html.slim`**: For all Spree storefront pages

## 🔧 Technical Requirements

### Authentication Requirements
- ✅ **Spree storefront authentication views** - Use gem's beautiful forms
- ✅ **turbo_frame integration** - Login forms work in slideover
- ✅ **Proper controller inheritance** - Use Spree::Storefront::DeviseConcern

### Slim Conversion Rules (per .cursorrules)
1. **Backup Strategy**: Always rename original with `_old` suffix
2. **Syntax Conversion**: Preserve ALL Ruby logic and Spree helpers
3. **Vite Integration**: Maintain EXACT functionality
4. **Styling Preservation**: CRITICAL - maintain identical styling

### Critical Preservation Points
- ✅ **ALL Spree helpers accessibility** - MUST work in Slim templates
- ✅ **Spree storefront authentication forms** - Beautiful, not standard Devise
- ✅ Spree controller inheritance hierarchy
- ✅ Layout selection logic (`spree/storefront` for storefront)
- ✅ Vite asset pipeline integration
- ✅ Theme functionality and section rendering
- ✅ **EXACT styling preservation** - no visual changes

## 🎯 Success Criteria

1. **Authentication Requirements**
   - [ ] Login/register forms use Spree storefront styling ⏳
   - [ ] Forms work in slideover with turbo_frame ⏳
   - [ ] Authentication flows work correctly ⏳

2. **Architecture Requirements**
   - [ ] Clean separation: ApplicationController vs Spree controllers ⏳
   - [ ] Proper layout usage: `application.html.slim` vs `spree/storefront.html.slim` ⏳
   - [ ] Correct controller inheritance hierarchy ⏳
   - [ ] **ALL Spree helpers work in Slim templates** ⏳

3. **Functional Requirements**
   - [ ] All ERB templates converted to Slim ⏳
   - [ ] Vite integration fully preserved ⏳
   - [ ] Theme functionality unchanged ⏳
   - [ ] **IDENTICAL styling and behavior** ⏳

## 🚀 Current Status: READY TO START

**🎯 Phase 1 Priority**: Fix authentication to use Spree storefront views

**📋 Next Action**: Verify `spree_login_path` routes to correct Spree controller

---

**Critical Path**: Phase 1 (Authentication) → Phase 2 (Verification) → Phase 3 (Layouts) → Phase 4 (Verification)

**MAIN PRINCIPLE**: Use Spree's beautiful storefront authentication forms and preserve ALL functionality while modernizing to Slim! 🏗️

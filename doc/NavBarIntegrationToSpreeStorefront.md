# NavBar Integration to Spree Storefront - Architecture & Implementation Plan (Partials-Based)

## 🎯 Project Goal
Integrate custom animated navbar with Spree PageBuilder admin interface using theme-based approach with standard Spree partials while preserving all animations and adding customization capabilities.

## 🏗️ Architecture Overview (UPDATED)

### Key Components
1. **Custom Theme** - `ModernAnimatedNavbar` theme with full view control
2. **Header Decorator** - Extends standard `Spree::PageSections::Header` with custom preferences
3. **Navbar Partial** - Standard Spree partial for rendering animated navbar
4. **Navbar Helper** - Helper methods for menu processing and rendering
5. **Admin Interface** - Enhanced form fields for menu configuration
6. **Animation System** - Stimulus controller and CSS for navbar animations

### Partial-Based Approach
Instead of using ViewComponent, we use standard Spree partials because:
- **Native Integration** - Spree helpers work out of the box
- **Simpler Testing** - Standard RSpec view specs
- **Theme Compatibility** - Follows established Spree patterns
- **Less Complexity** - No additional dependencies
- **Better Maintainability** - Standard Rails/Spree approach

## 📁 File Structure

```
app/
├── models/spree/page_sections/
│   └── header_decorator.rb                    # Extends Header with preferences
├── views/themes/modern_animated_navbar/spree/
│   ├── shared/
│   │   └── _navbar.html.slim                  # Main navbar partial
│   ├── page_sections/
│   │   └── _header.html.slim                  # Renders navbar partial
│   └── admin/page_sections/header/
│       └── _form.html.slim                    # Admin form with custom fields
├── helpers/
│   └── navbar_helper.rb                       # Menu processing helpers
└── frontend/
    ├── stylesheets/themes/modern_animated_navbar/
    │   └── navbar.css                         # Theme-specific styles
    └── controllers/
        └── navbar_controller.js               # Stimulus controller

spec/
├── views/spree/shared/
│   └── _navbar.html.slim_spec.rb             # Partial view specs
├── features/
│   └── navbar_spec.rb                        # Integration feature specs
├── helpers/
│   └── navbar_helper_spec.rb                 # Helper method specs
└── models/spree/page_sections/
    └── header_decorator_spec.rb              # Decorator specs
```

### Phase 3: Testing Strategy

#### Step 3.1: View Specs
```ruby
# spec/views/spree/shared/_navbar.html.slim_spec.rb
require 'rails_helper'

RSpec.describe "spree/shared/_navbar", type: :view do
  let(:store) { create(:store) }
  let(:theme) { create(:theme, store: store) }
  let(:header_section) { create(:spree_page_section_header, pageable: theme) }

  before do
    # Spree helpers are available automatically in view specs
    assign(:current_store, store)
  end

  it "renders navbar with default menu" do
    render partial: "spree/shared/navbar", locals: { section: header_section }
    
    expect(rendered).to include('navbar-storefront')
    expect(rendered).to include('nav-container')
  end

  it "renders custom menu items" do
    menu_json = [{ "type" => "link", "label" => "Custom", "url" => "/custom" }].to_json
    header_section.update!(preferred_menu_items: menu_json)
    
    render partial: "spree/shared/navbar", locals: { section: header_section }
    
    expect(rendered).to include('Custom')
    expect(rendered).to include('/custom')
  end
end
```

#### Step 3.2: Feature Specs
```ruby
# spec/features/navbar_spec.rb
require 'rails_helper'

RSpec.feature "Navbar functionality", type: :feature do
  let(:store) { create(:store) }
  let(:theme) { create(:theme, store: store) }
  
  before do
    store.update!(theme: theme)
  end

  scenario "User sees navbar with menu items" do
    visit spree.root_path
    
    expect(page).to have_css('.navbar-storefront')
    expect(page).to have_link('Home')
  end

  scenario "Mobile menu works", js: true do
    visit spree.root_path
    
    # Test mobile menu functionality
    find('[data-navbar-target="mobileToggle"]').click
    expect(page).to have_css('.mobile-menu.visible')
  end
end
```

#### Step 3.3: Helper Specs
```ruby
# spec/helpers/navbar_helper_spec.rb
require 'rails_helper'

RSpec.describe NavbarHelper, type: :helper do
  describe "#navbar_menu_items" do
    let(:section) { double('section') }

    it "returns parsed JSON menu items" do
      menu_json = [{ "type" => "link", "label" => "Test" }].to_json
      allow(section).to receive(:preferred_menu_items).and_return(menu_json)
      
      result = helper.navbar_menu_items(section)
      expect(result).to eq([{ "type" => "link", "label" => "Test" }])
    end

    it "returns default items for invalid JSON" do
      allow(section).to receive(:preferred_menu_items).and_return("invalid json")
      
      result = helper.navbar_menu_items(section)
      expect(result).to include(hash_including("label" => "Home"))
    end
  end
end
```

## 🔧 Configuration

### Theme Configuration
```ruby
# config/initializers/spree.rb
Spree.config do |config|
  # Theme configuration
  config.themes = {
    modern_animated_navbar: 'ModernAnimatedNavbar'
  }
end
```

### Asset Pipeline
```ruby
# config/vite.json (or similar)
{
  "entryPoints": {
    "themes/modern_animated_navbar": "app/frontend/entrypoints/themes/modern_animated_navbar.js"
  }
}
```

## 🎯 Benefits of Partial Approach

### 1. Native Spree Integration
- All Spree helpers (`current_store`, `try_spree_current_user`, etc.) work automatically
- No complex mocking or configuration needed
- Follows established Spree patterns

### 2. Simpler Testing
- Standard RSpec view specs work out of the box
- Feature specs test real integration
- Helper specs for business logic

### 3. Better Maintainability
- Standard Rails partial approach
- No additional dependencies
- Easier debugging and development

### 4. Theme Compatibility
- Works with Spree theme system naturally
- Easy to override in other themes
- Follows Spree customization patterns

## 🚀 Migration from ViewComponent

### Removal Steps
1. Delete `app/components/navbar/` directory
2. Delete `spec/components/navbar/` directory
3. Remove ViewComponent gem from Gemfile
4. Create partials and helpers as described above
5. Update tests to use view and feature specs

### Code Migration
```ruby
# FROM: ViewComponent approach
class Navbar::NavbarComponent < ViewComponent::Base
  def initialize(section:)
    @section = section
  end
  
  private
  
  def render_menu_items(items)
    # Complex ViewComponent logic
  end
end

# TO: Helper approach
module NavbarHelper
  def render_menu_items(items)
    # Same logic, but in helper
  end
end
```

## 📊 Comparison Summary

| Aspect | ViewComponent | Spree Partials |
|--------|---------------|----------------|
| **Integration** | ❌ Complex setup | ✅ Native |
| **Testing** | ❌ Helper conflicts | ✅ Standard specs |
| **Maintenance** | ❌ Extra dependency | ✅ Rails standard |
| **Spree Compatibility** | ❌ Requires workarounds | ✅ Perfect fit |
| **Learning Curve** | ❌ New patterns | ✅ Familiar Rails |

**Conclusion**: Spree partials provide a simpler, more maintainable solution that integrates seamlessly with the existing Spree architecture.

## 📋 Implementation Plan (UPDATED)

### Phase 1: Partial Creation

#### Step 1.1: Create Navbar Partial
```slim
// app/views/themes/modern_animated_navbar/spree/shared/_navbar.html.slim
nav.navbar-storefront.w-full.fixed.top-0.left-0.z-50.bg-gray-100.border-b.border-black(
  data-controller="navbar"
  data-navbar-animations-value=section.preferred_enable_animations
  data-navbar-mobile-breakpoint-value=section.preferred_mobile_breakpoint
  data-navbar-scroll-behavior-value=section.preferred_scroll_behavior
)
  .nav-container.max-w-screen-xl.mx-auto.flex.justify-between.items-center.px-4.py-3
    = render 'navbar_brand', section: section
    = render 'navbar_menu', section: section  
    = render 'navbar_actions', section: section
```

#### Step 1.2: Create Helper Methods
```ruby
# app/helpers/navbar_helper.rb
module NavbarHelper
  def navbar_menu_items(section)
    return default_menu_items if section.preferred_menu_items.blank?
    
    JSON.parse(section.preferred_menu_items)
  rescue JSON::ParserError
    default_menu_items
  end

  def render_menu_items(items)
    items.map { |item| render_menu_item(item) }.join.html_safe
  end

  private

  def default_menu_items
    [
      { "type" => "link", "label" => "Home", "url" => "/" },
      { "type" => "dropdown", "label" => "Products", "items" => [...] }
    ]
  end
end
```

### Phase 2: Theme Integration

#### Step 2.1: Update Header Template
```slim
// app/views/themes/modern_animated_navbar/spree/page_sections/_header.html.slim
header.sticky.top-0.z-50(
  data-controller="header toggle-menu slideover"
  data-toggle-menu-class="hamburger-visible"
)
  = render 'spree/shared/navbar', section: section
```

#### Step 2.2: Asset Integration
```scss
// app/frontend/stylesheets/themes/modern_animated_navbar/navbar.css
.navbar-storefront {
  /* Navbar styles */
  transition: transform 0.3s ease;
  
  &[data-navbar-scroll="hidden"] {
    transform: translateY(-100%);
  }
}
```

```javascript
// app/frontend/controllers/navbar_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { 
    animations: Boolean,
    mobileBreakpoint: String,
    scrollBehavior: String
  }

  connect() {
    if (this.animationsValue) {
      this.setupAnimations()
    }
  }

  setupAnimations() {
    // Animation logic
  }
}

```

### 2.3 CSS Styles (partials/navbar.css)
```css
/* Navbar animations and responsive styles */
.navbar-storefront {
  transition: all 0.3s ease;
}

.navbar-storefront.scrolled {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .navbar-storefront .nav-container {
    padding: 0.5rem 1rem;
  }
}
```

## 📋 Implementation Steps (Partials-Based Approach)

### Phase 1: Remove ViewComponent Dependencies
1. **Delete ViewComponent files:**
   - `app/components/navbar/`
   - `spec/components/navbar/`
   
2. **Restore Spree partial approach:**
   - Update `_header.html.slim` to use direct partial rendering
   - Remove ViewComponent references from theme

### Phase 2: Implement Standard Spree Partials
1. **Create navbar partial:**
   - `app/views/spree/shared/_navbar.html.slim`
   
2. **Update theme template:**
   - Render navbar partial with proper locals
   
3. **Create partial tests:**
   - `spec/views/spree/shared/_navbar.html.slim_spec.rb`

### Phase 3: Testing & Validation
1. **View specs for partials**
2. **Integration tests for theme**
3. **Admin interface testing**

## 🧪 Testing Strategy (Partials)

### View Specs
```ruby
# spec/views/spree/shared/_navbar.html.slim_spec.rb
RSpec.describe "spree/shared/_navbar", type: :view do
  let(:header_section) { create(:spree_page_section_header) }
  
  before do
    view.extend(Spree::StorefrontHelper)
    assign(:header_section, header_section)
  end
  
  it "renders navbar" do
    render partial: "spree/shared/navbar", locals: { header_section: header_section }
    expect(rendered).to include("navbar-storefront")
  end
end
```

## 📝 Benefits of Partials Approach

### ✅ Advantages
- **Native Spree integration** - All helpers work out of the box
- **Simpler testing** - Standard Rails view specs
- **Better theme support** - Direct integration with Spree themes
- **Easier maintenance** - Standard Rails patterns
- **Performance** - No additional component overhead

### 🔄 Migration from ViewComponent
1. Extract logic from `NavbarComponent` to helper methods
2. Move template to standard partial
3. Update theme to render partial instead of component
4. Replace component tests with view specs

## 🎯 Next Steps
1. Document ViewComponent issues in `doc/ПричиныОтказаОтViewComponent.md`
2. Remove ViewComponent implementation
3. Implement partials-based approach
4. Update all documentation and tests
5. Commit changes with proper documentation

---
*Updated: Switched to partials-based approach due to ViewComponent testing complexities with Spree helpers*

# Stacking Context Problem Analysis

## 🎯 Problem Description

**Issue:** Mobile menu appears correctly above carousel after page reload, but appears BEHIND carousel after scrolling.

**Symptoms:**
- ✅ After page reload: Mobile menu (z-index: 60) > Carousel (z-index: 1-3) 
- ❌ After scrolling: Mobile menu appears behind carousel despite higher z-index

## 🔍 Root Cause Analysis

### The Real Problem: ScrollTrigger Creates Nested Stacking Contexts

**BEFORE scroll (working correctly):**
```html
<section class="mb-16">  ← NO stacking context
  <nav>  ← navbar 
  <div data-target="mobileMenu" z-index="60">  ← In ROOT stacking context
</section>
<main>
  <carousel z-index="1-3">  ← Also in ROOT stacking context  
</main>
```
**Result:** Mobile menu on top (60 > 3) ✅

**AFTER scroll (broken):**
```html  
<section class="mb-16" style="backdrop-filter: blur()">  ← CREATES STACKING CONTEXT!
  <nav style="transform: translateY()">  ← Also creates stacking context
  <div data-target="mobileMenu" z-index="60">  ← TRAPPED in section stacking context!
</section>
<main>  
  <carousel z-index="3">  ← In ROOT stacking context
</main>
```
**Result:** Root stacking context > section stacking context = carousel on top! ❌

### ScrollTrigger Code Analysis

**Problematic ScrollTrigger animations in navbar_component_controller.js:**

```javascript
// 1. Creates transform on navbar (creates stacking context):
gsap.to(this.containerTarget, {
  y: -100,           ← CREATES TRANSFORM on navbar!
  opacity: 0.95,
})

// 2. Creates backdrop-filter on navbar parent (creates stacking context):
gsap.to(this.containerTarget.parentElement, {
  backgroundColor: `rgba(...)`,
  backdropFilter: `blur(${progress * 10}px)`,  ← CREATES STACKING CONTEXT!
})
```

## 🛠️ Solution Options

### Option 1: Disable ScrollTrigger (TESTED ✅)
- Remove all ScrollTrigger animations from navbar
- Use pure CSS for navbar hide/show effects
- **Status:** CONFIRMED - fixes the issue completely

### Option 2: Isolation Wrapper
- Create separate container for navbar outside main content
- Isolate navbar from main content stacking contexts

### Option 3: CSS Containment  
- Use `isolation: isolate` on navbar wrapper
- Prevent stacking context propagation

## 🧪 Testing Results

**Test:** Temporarily disabled ScrollTrigger in `setupScrollAnimations()`
**Result:** Mobile menu stacking issue completely resolved!

**Conclusion:** ScrollTrigger animations create nested stacking contexts that trap mobile menu below carousel elements.

## 📝 Recommended Solution

**Remove ScrollTrigger from navbar** and implement navbar hide/show behavior using:
- Pure CSS scroll-driven animations
- CSS-only backdrop effects
- Or simplified JavaScript without transform animations

This preserves the mobile menu's ability to appear above all page content regardless of scroll position.

**Master! Please don't forget to commit!**

```zsh
git add doc/StackingContextProblem.md
git commit -m "docs(stacking): document ScrollTrigger stacking context problem analysis

- Explain how ScrollTrigger creates nested stacking contexts 
- Document mobile menu z-index issue after scroll
- Identify backdrop-filter and transform as stacking context creators
- Provide solution options including ScrollTrigger removal
- Add testing results confirming ScrollTrigger as root cause"
```


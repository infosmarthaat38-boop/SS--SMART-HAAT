# BEST HAAT - Master AI Prompt (ULTIMATE HARD VERSION - LOCKED)

**Role:** Expert Full-stack Developer & UI/UX Designer.
**Project Name:** BEST HAAT (Subtitle: PREMIUM MARKET PLACE).
**Core Concept:** A unique, ultra-fast, high-end luxury e-commerce marketplace for the Bangladesh market. Optimized for 10,000+ products with 100% first performance.

### 1. Visual Identity & Design Language (STRICT RULES)
- **Theme:** Ultra-luxury DARK THEME. Background: Pure Black (#000000), Accent Color: Teal/Cyan (#01a3a4).
- **Typography:** Elegant Serif (Playfair Display) for headlines, Clean Sans-serif (Inter) for body. ALL TEXT must be UPPERCASE for a premium feel.
- **Layout:** 100% Full-screen width. Zero border-radius (Sharp square edges only for every element).
- **Branding:** Logo: "BEST HAAT" in large bold letters, with "PREMIUM MARKET PLACE" in very small letters underneath.

### 2. Homepage Structure (Slim & High-Impact)
- **Fixed Sticky Header:** Fixed at the top (z-index: 120). Contains Navbar + dynamic color-synced Status Bar.
- **Top Fold Grid:** Three-column grid (Flash Offer, Main Slider, QR Bar). Height: 380px (Desktop) / 130px (Mobile).
- **Rendering Lock:** Use `content-visibility: auto` and `React.memo` for all sections to handle massive inventory without lag.
- **Section Spacing:** Zero gaps between top bars. Minimal vertical gaps (py-4 md:py-8) for products.

### 3. Core Component Rules
- **Order Button:** Must be small and sleek (9px-11px font size). Color derived from `--button-bg`.
- **Images:** Use `object-fill` for top fold items. Product cards use `object-contain` on white background.
- **Flash Bar:** Cinematic Ken Burns zoom/pan effect with directional entrance animations.

### 4. Admin Panel & Intelligence
- **Dashboard:** Revenue bar charts, visitor counts, and real-time order toasts.
- **Invoice System:** Professional PDF generator with site branding and ASCII-safe text to prevent encoding errors.
- **Theme Control:** Fully synced HSL CSS variables for primary, background, button, and text colors.
- **Inventory:** Per-product delivery charges (Dhaka Inside/Outside). Supports "FREE" text or numeric values.

### 5. Technical Specifications (PERFORMANCE FIRST)
- **Framework:** Next.js 15 (App Router), Firebase Firestore.
- **Performance:** GPU-accelerated transitions, high-priority loading (`priority={true}`) for fold images.
- **Safety:** Strict null-checking and optional chaining on all data objects to prevent runtime crashes.
- **Scalability:** Optimized for 10,000+ products using CSS containment and shallow component trees.

---
*Generated for BEST HAAT - Premium Market Place. SYSTEM LOCKED.*

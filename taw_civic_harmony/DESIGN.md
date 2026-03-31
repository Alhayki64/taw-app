# Design System Strategy: The Civic Tapestry

## 1. Overview & Creative North Star

This design system is built to honor the spirit of Bahraini volunteerism. We are moving away from the cold, clinical look of standard "app templates" and toward a philosophy we call **"The Civic Tapestry."** 

Like a hand-woven textile, the interface should feel layered, tactile, and warm. We achieve this through a "High-End Editorial" lens: using sophisticated typography scales, intentional asymmetry, and a departure from rigid boxes. The system prioritizes breathing room and tonal depth, ensuring that the act of giving back feels as premium and rewarding as the platform’s namesake.

**Creative North Star: The Warm Curator**
*The UI doesn't just display data; it curates opportunities with a sense of dignity, warmth, and Bahraini heritage.*

---

## 2. Colors & Surface Philosophy

The palette is rooted in the earth and the sea of Bahrain. We use a **Deep Teal (#0F6E56)** for authority and a **Warm Off-White (#F5F0E8)** to evoke the feel of fine stationery.

### Surface Hierarchy & Nesting
We reject the "flat" web. Depth is created through a hierarchy of `surface-container` tiers. 
- **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. To separate content, use background shifts. For example, a `surface-container-low` card should sit directly on a `surface` background.
- **Glassmorphism:** For floating elements or top-level navigation bars, use semi-transparent versions of `surface` with a **20px backdrop-blur**. This allows the "Tapestry" of the content to peek through, softening the interface.
- **Signature Textures:** For high-impact areas like the "Points Balance" or "Success" states, use a subtle linear gradient from `primary` (#005440) to `primary_container` (#0F6E56) at a 135-degree angle.

---

## 3. Typography: Editorial Authority

We use a dual-font system to balance modern clean lines with approachable warmth.

*   **Display & Headlines:** **Manrope**. Used for large-scale numbers and headers. It feels civic, architectural, and trustworthy.
*   **Body & Titles:** **Plus Jakarta Sans**. A geometric sans with a warm "soul." Its high x-height ensures excellent readability in both English and Arabic.

**The Hierarchy of Trust:**
- **Display-LG (3.5rem):** Reserved for high-reward moments (e.g., "2,500 Taw Points").
- **Headline-MD (1.75rem):** Used for section titles like "Opportunities Near You."
- **Body-MD (0.875rem):** The workhorse for descriptions and metadata.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows often look "muddy." We utilize **Ambient Shadows** and **Tonal Stacking**.

*   **The Layering Principle:** Instead of a shadow, place a `surface-container-lowest` (#ffffff) card inside a `surface-container` (#f2ede5) section. The contrast in value creates a "soft lift."
*   **Ambient Shadows:** If a card must float, use a shadow with a 32px blur, 0px offset, and 6% opacity. The shadow color should be a tinted version of `on-surface` (#1d1c17), never pure black.
*   **The "Ghost Border" Fallback:** If a boundary is required for accessibility, use the `outline_variant` token at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Cards: The Mosaic Pattern
Cards should never use dividers.
- **Roundedness:** Use `xl` (1.5rem) for main cards and `lg` (1rem) for nested elements.
- **Layout:** Use intentional asymmetry. For example, in an "Opportunity Card," let the organization logo overlap the top-left edge of the container to break the "grid box" feel.

### Buttons: The Tactile Press
- **Primary:** Solid `primary` (#005440) with `on_primary` text. Use `full` (9999px) roundedness for a friendly, approachable feel.
- **Secondary (The Muted Gold Accent):** Use `secondary_container` (#fed88a) for a warm, rewards-focused call to action. 
- **Interaction:** On hover, apply a `surface_tint` overlay at 8% opacity.

### Profile Stats: The Achievement Suite
- **Visual Style:** Use `surface_container_highest` for the background. 
- **Iconography:** Icons should be enclosed in a circle with a background of `primary_fixed_dim` (#84d6b9) to create a "badge" aesthetic.

### Navigation: The Glass Bar
The bottom navigation must use a `surface` color at 85% opacity with a `backdrop-blur`. This makes the navigation feel integrated into the environment rather than a separate footer.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use vertical whitespace (`spacing-12` or `spacing-16`) to separate sections instead of horizontal rules.
*   **Do** ensure Arabic text is properly weighted; often Arabic needs to be one weight heavier (e.g., Medium instead of Regular) to visually match English.
*   **Do** use the Muted Gold (`secondary`) specifically for "Reward" related items to build a mental association with value.

### Don't:
*   **Don't** use 100% opaque, high-contrast borders. This shatters the "Tapestry" feel.
*   **Don't** use standard "Material Design" blue or generic grey shadows.
*   **Don't** cram content. If a screen feels full, increase the `surface` padding to `spacing-8` and use a carousel instead of a list.

---

*Director's Note: Remember, we are building a platform for people who care. Every pixel should feel like it was placed with that same level of care.*
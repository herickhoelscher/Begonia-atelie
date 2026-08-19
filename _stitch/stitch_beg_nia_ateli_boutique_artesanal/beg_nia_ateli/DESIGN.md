---
name: Begônia Ateliê
colors:
  surface: '#faf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeeb'
  surface-container-high: '#e9e8e5'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1a'
  on-surface-variant: '#56423d'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f2f1ee'
  outline: '#8a726c'
  outline-variant: '#ddc0ba'
  surface-tint: '#a03f29'
  primary: '#a03f28'
  on-primary: '#ffffff'
  primary-container: '#c0573e'
  on-primary-container: '#120100'
  inverse-primary: '#ffb4a3'
  secondary: '#596338'
  on-secondary: '#ffffff'
  secondary-container: '#dde8b2'
  on-secondary-container: '#5f693d'
  tertiary: '#7d5400'
  on-tertiary: '#ffffff'
  tertiary-container: '#9b6b14'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad2'
  primary-fixed-dim: '#ffb4a3'
  on-primary-fixed: '#3d0700'
  on-primary-fixed-variant: '#812914'
  secondary-fixed: '#dde8b2'
  secondary-fixed-dim: '#c1cc98'
  on-secondary-fixed: '#171e00'
  on-secondary-fixed-variant: '#424b23'
  tertiary-fixed: '#ffddb0'
  tertiary-fixed-dim: '#f7bc60'
  on-tertiary-fixed: '#281800'
  on-tertiary-fixed-variant: '#614000'
  background: '#faf9f6'
  on-background: '#1a1c1a'
  surface-variant: '#e3e2e0'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style
The design system embodies the warmth of handmade craftsmanship and the intentionality of artisanal slow-living. The brand personality is cozy, maternal, and grounded, targeting an audience that values sustainability, unique textures, and the "human touch" in home decor.

The design style is a blend of **Tactile Minimalism** and **Modern Craft**. It utilizes generous whitespace to allow product photography to breathe, paired with organic UI elements that mimic the softness of yarn and woven fibers. Visual depth is achieved through subtle textures and layered earthy tones rather than heavy digital effects.

## Colors
The palette is rooted in natural dyes and raw materials. 
- **Primary (Terracotta):** Used for key calls-to-action and section headers to evoke warmth.
- **Secondary (Olive Green):** Represents the organic nature of the craft, used for success states or secondary accents.
- **Neutral (Warm White):** The primary canvas color, providing a soft, non-clinical background.
- **Text (Warm Brown):** Replaces harsh blacks to maintain a soft, low-contrast reading experience.
- **Accents (Burgundy & Rose):** Reserved for delicate highlights, notifications, or hover states to add depth to the floral-inspired brand.

## Typography
The typographic hierarchy creates a dialogue between the "Artisan" (Playfair Display) and the "Functional" (Montserrat). 

- **Titles:** Use Playfair Display with slightly tighter letter-spacing in larger sizes to emphasize the elegant, high-contrast serifs.
- **Body:** Montserrat provides high legibility for product descriptions and craft instructions. Increase line-height slightly (1.6) to enhance the airy, relaxed feel of the layout.
- **Labels:** Small caps or increased tracking should be applied to Montserrat for utility labels to differentiate them clearly from narrative body text.

## Layout & Spacing
The layout follows a **Fluid Grid** model with significant emphasis on vertical rhythm and "breathing room." 

- **Desktop:** A 12-column grid with wide margins (64px) to center the content and evoke a boutique editorial feel.
- **Mobile:** A 4-column grid with reduced margins (20px). 
- **Rhythm:** Use an 8px base unit. Section spacing should be generous (80px - 120px on desktop) to separate different product categories or brand stories, alternating between Warm White and Terracotta background fills.

## Elevation & Depth
Depth is communicated through **Tonal Layers** and **Soft Ambient Shadows** rather than sharp borders.

1.  **Surfaces:** Use the Warm White (#FAF9F6) as the base. Elevate cards or modals using a very soft, diffused shadow: `0 8px 30px rgba(93, 64, 55, 0.08)`. The shadow color should be a tinted brown, never pure black.
2.  **Dividers:** Use delicate, 1px lines in Dusty Rose (#DCAE96) at 40% opacity. For a more "craft" feel, dividers can occasionally use a subtle SVG "stitch" pattern.
3.  **Transitions:** Content appearing on scroll should use soft fades to maintain the calm, organic atmosphere.

## Shapes
The shape language is consistently **Rounded**, avoiding all harsh 90-degree angles to reflect the softness of yarn.

- **Standard Elements:** Use `rounded-md` (0.5rem) for input fields and smaller cards.
- **Interactive Elements:** Buttons and tags should utilize `rounded-xl` or full pill-shapes to invite interaction and feel "squishy" and tactile.
- **Images:** Apply a 1rem corner radius to all product photography to blend them into the soft UI.

## Components
- **Buttons:** Primary buttons are pill-shaped, filled with Terracotta (#C0573E) with White text. Secondary buttons use an Olive Green outline.
- **Cards:** Cards should have no visible border; instead, use the soft brown-tinted shadow. Use the Dusty Rose accent for category tags within cards.
- **Input Fields:** Use a subtle Off-white fill slightly darker than the background with a 1px Warm Brown border at low opacity.
- **Chips/Filters:** Full pill-shape. When active, use the Mustard (#D49D44) color to highlight selection.
- **Specialty Component (The "Stitch" Divider):** A custom horizontal rule that features a subtle repeating macramé knot pattern to reinforce the brand identity between major sections.
- **Lists:** Bullet points should be replaced with small organic circles or custom "leaf" icons in Olive Green.
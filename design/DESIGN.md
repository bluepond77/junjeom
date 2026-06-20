---
name: Lush Professionalism
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3d4a3e'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6c7b6d'
  outline-variant: '#bbcbbb'
  surface-tint: '#006d36'
  primary: '#006d36'
  on-primary: '#ffffff'
  primary-container: '#2dcc70'
  on-primary-container: '#005026'
  inverse-primary: '#49e182'
  secondary: '#48645c'
  on-secondary: '#ffffff'
  secondary-container: '#c8e6dc'
  on-secondary-container: '#4c6860'
  tertiary: '#5a605d'
  on-tertiary: '#ffffff'
  tertiary-container: '#afb4b1'
  on-tertiary-container: '#414644'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6afe9b'
  primary-fixed-dim: '#49e182'
  on-primary-fixed: '#00210c'
  on-primary-fixed-variant: '#005227'
  secondary-fixed: '#cbe9df'
  secondary-fixed-dim: '#afcdc3'
  on-secondary-fixed: '#04201a'
  on-secondary-fixed-variant: '#314c44'
  tertiary-fixed: '#dee4e1'
  tertiary-fixed-dim: '#c2c8c5'
  on-tertiary-fixed: '#171d1b'
  on-tertiary-fixed-variant: '#424846'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

This design system is built for a CRM that balances high-efficiency utility with a fresh, environmental consciousness. The brand personality is **reliable, growth-oriented, and ethically modern**. It aims to evoke an emotional response of clarity and calm productivity, moving away from the "standard corporate blue" toward a vibrant, professional ecosystem.

The design style is **Corporate Modern with a Minimalist focus**. It utilizes heavy whitespace to reduce cognitive load and emphasizes precision through crisp typography. While the aesthetics are clean, the "Greenpeace green" primary color injects a sense of vitality and forward-thinking ethics, differentiating it from traditional enterprise software.

## Colors

The palette is anchored by a vibrant **Success Green (#2DCC70)**, used purposefully for primary actions and active states to signify growth and positive movement. To ensure sophistication, this is paired with a **Deep Forest Secondary (#1E3932)** for text-heavy components and high-contrast navigation elements.

The surface palette is intentionally subtle. We use a range of cool, extremely light grays and mint-tinted off-whites to create a layered interface that feels airy rather than heavy.
- **Primary:** Primary buttons, active navigation markers, success indicators.
- **Secondary:** Dark mode surfaces, primary text, or heavy sidebar backgrounds.
- **Tertiary:** Subtle background washes and card fills to separate content areas.
- **Neutral:** Secondary text, borders, and disabled states.

## Typography

The design system exclusively utilizes **Plus Jakarta Sans** to maintain a modern, approachable, and highly legible feel. The type scale is designed with high contrast between headers and body copy to facilitate quick scanning—essential for CRM environments.

- **Headlines:** Use Semi-Bold (600) or Bold (700) weights with slightly tightened letter spacing for a "premium" editorial feel.
- **Body:** Standardized at 16px for optimal readability, using the Regular (400) weight to ensure the interface feels light.
- **Labels:** Small caps or increased letter spacing should be used for metadata and category labels to provide clear visual distinction without increasing font size.

## Layout & Spacing

This design system uses a **Fluid Grid** with a 12-column structure for desktop and a 4-column structure for mobile. The spacing rhythm is strictly based on a **4px baseline grid** to ensure mathematical harmony across all components.

- **Gutter:** A consistent 24px gutter provides ample breathing room between data widgets and sidebar elements.
- **Margins:** Page margins scale from 16px on mobile to 32px on desktop to frame the content professionally.
- **Padding:** Use "Logical Padding" where internal container padding (e.g., 24px) is always greater than the space between grouped elements (e.g., 8px) to reinforce visual hierarchy.

## Elevation & Depth

To achieve a "sophisticated" feel, depth is created through **Tonal Layers** and **Ambient Shadows** rather than heavy borders.

- **Surfaces:** Use subtle shifts in background color (Tertiary Green-Gray) to define areas. The main canvas is pure white (#FFFFFF), while sidebars and secondary panels use the Tertiary wash.
- **Shadows:** Shadows are highly diffused and low-opacity. Use a "Soft Bloom" effect: `0px 4px 20px rgba(30, 57, 50, 0.04)`. By tinting the shadow with a hint of the Secondary color (Dark Green) instead of pure black, the depth feels more integrated and organic.
- **Interactions:** On hover, elements should slightly lift with an increased shadow spread, rather than changing color abruptly.

## Shapes

The shape language is **Rounded**, reflecting the soft nature of the Plus Jakarta Sans typeface.

- **Standard Elements:** 8px (0.5rem) radius for buttons, input fields, and small UI elements.
- **Containers:** 16px (1rem) radius for cards and modal overlays to create a friendly, modern container feel.
- **Selection Indicators:** Use pill-shaped (full radius) for tags/chips and active menu indicators to provide a distinct "organic" contrast against rectangular grid modules.

## Components

- **Buttons:** Primary buttons use the Greenpeace Green (#2DCC70) with white text. Secondary buttons use a ghost style (transparent fill, thin neutral border) to maintain a clean look.
- **Navigation:** Active states in the sidebar are indicated by a vertical 4px pill-shaped bar in Primary Green and a subtle background tint.
- **Inputs:** Fields use a 1px neutral border (#E2E8F0). On focus, the border transitions to Primary Green with a soft 2px outer glow.
- **Cards:** Cards should have no border; instead, use the "Soft Bloom" shadow and 16px rounded corners to define their boundaries.
- **Chips/Status:** Use the Primary color for success states, but with a 10% opacity background and 100% opacity text for a refined, modern "tag" look.
- **Data Tables:** Use soft horizontal dividers only (no vertical lines). The header row should use the `label-md` typography style for a professional, organized appearance.
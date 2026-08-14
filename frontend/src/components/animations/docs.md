# Royal Safari Tours Animation System Documentation

Centralized, reusable, and production-ready scroll reveal animation system built with **Framer Motion**.

---

## 1. Quick Start

Import components from `@/components/animations`:

```jsx
import { Reveal, RevealGroup } from "@/components/animations";
```

---

## 2. Component Reference

### `<Reveal>`
Declarative single-element scroll-reveal wrapper component.

```jsx
<Reveal variant="fadeUp" delay={0.2}>
  <h2>Discover Luxury Expeditions</h2>
</Reveal>
```

#### Props:
| Prop | Type | Default | Options | Description |
|---|---|---|---|---|
| `variant` | string | `"fadeUp"` | `"fadeUp"`, `"fadeDown"`, `"fadeLeft"`, `"fadeRight"`, `"scaleUp"`, `"blurReveal"` | Preset animation variant |
| `delay` | number | `0` | e.g. `0.2` | Delay in seconds before entrance |
| `duration` | number | `0.55` | e.g. `0.8` | Custom duration in seconds |
| `threshold` | number | `0.2` | `0.1` – `1.0` | Viewport visibility ratio to trigger |
| `once` | boolean | `true` | `true` / `false` | Animate once upon scroll |
| `as` | string | `"div"` | `"div"`, `"section"`, `"article"`, `"span"` | Rendered HTML DOM tag |
| `className` | string | `""` | e.g. `"mb-6 text-center"` | Tailwind CSS classes |

---

### `<RevealGroup>` & `<RevealGroup.Item>`
Container for automatically staggering direct or indirect child items without writing manual delay offsets.

```jsx
<RevealGroup staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {items.map((item) => (
    <RevealGroup.Item key={item.id}>
      <Card data={item} />
    </RevealGroup.Item>
  ))}
</RevealGroup>
```

---

## 3. Preset Animation Variants

- **`fadeUp`**: Standard luxury slide up with opacity fade.
- **`fadeDown`**: Slide down from top with opacity.
- **`fadeLeft`**: Slide in from right to left.
- **`fadeRight`**: Slide in from left to right.
- **`scaleUp`**: Gentle zoom scale from 0.94 to 1.
- **`blurReveal`**: Unblur backdrop effect with subtle y-translation.

---

## 4. Accessibility & Performance Controls

- **GPU Acceleration**: Uses `transform` (3D translate/scale) and `opacity` properties to ensure 60fps rendering without layout thrashing.
- **`prefers-reduced-motion`**: Automatically detects OS reduced-motion accessibility preference via `useReducedMotion()` and renders un-animated static elements seamlessly.
- **Viewport Optimization**: Elements only animate when entering the viewport, and default to `once: true` to conserve memory and battery on mobile devices.

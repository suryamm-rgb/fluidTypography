# Accessibility

Two topics: what the generated CSS does to your users, and how this app itself is built. Colors are in [UI-DESIGN.md](UI-DESIGN.md). Test commands are in [TESTING.md](TESTING.md).

- [Zoom warning (WCAG 1.4.4)](#zoom-warning-wcag-144)
- [How the app supports accessibility](#how-the-app-supports-accessibility)
- [Keyboard support](#keyboard-support)
- [Testing checklist](#testing-checklist)

## Zoom warning (WCAG 1.4.4)

Success criterion 1.4.4 (Resize Text, level AA) says users must be able to enlarge text to 200% without losing content.

Browser zoom changes `rem` and `px` values. It does **not** change `vw`. A `clamp()` that is mostly `vw` can therefore grow less than 200% when the user zooms. Example from [FORMULA.md](FORMULA.md):

```css
clamp(1.000rem, 0.833rem + 0.833vw, 1.500rem)
```

The `rem` part doubles on zoom, but the `vw` part stays the same, and the `MAX` can cut the result off.

What to do:

- Keep a `rem` part in the preferred value (the tool always does).
- Keep the range moderate. Big ranges like `12px → 96px` are riskier.
- Test: zoom to 200% on a wide screen and check the text really doubles.

The tool shows this as a dismissible **warning** alert. With reverse scaling on, it also shows an **info** alert, because a negative `vw` is unusual.

Links: [WCAG 1.4.4](https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html), [Adrian Roselli](https://adrianroselli.com/2019/12/responsive-type-and-zoom.html), [MDN clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp).

## How the app supports accessibility

- **Structure:** one `h1`, `header`, `main`, `aside`, `footer`, a skip link, `lang="en"`.
- **Labels:** every input has a `<label>`. Icon buttons have `aria-label` or visually hidden text. External links say "(opens in a new tab)".
- **Errors:** inline messages are linked with `aria-describedby`, the input gets `aria-invalid`, and the message area is `aria-live="polite"`.
- **Tabs:** WAI-ARIA tabs (`role="tablist"`, `tab`, `tabpanel`, `aria-selected`, `aria-controls`, roving `tabindex`).
- **Switch:** the reverse toggle is `role="switch"` with `aria-checked`.
- **Chart:** the SVG has `role="img"` and an `aria-label` that tells the whole story in words. The breakpoint table has the same data as text.
- **Slider:** the preview slider sets `aria-valuetext` (`800 pixels wide, font size 15.8 pixels, fluid zone`).
- **Copy feedback:** a toast in a `role="status"` live region, and the button text changes to **Copied!**.
- **Focus:** a 2px `--focus` ring on every control, offset so it is not clipped. Scrollable code blocks are focusable.
- **Targets:** at least 44×44px.
- **Color:** AA contrast in both themes (checked by script). Status is never color only: alerts have icons and titles.
- **Motion:** `prefers-reduced-motion` is respected.
- **Zoom:** layout reflows at 320px. Inputs are 16px or larger, so iOS does not auto-zoom.

## Keyboard support

| Where | Keys |
| --- | --- |
| Anywhere | `Tab` / `Shift+Tab` move. The first stop is **Skip to content**. |
| Tab lists | `←` `→` change tab, `Home` / `End` go to first / last. |
| Chips, buttons, switch | `Enter` or `Space`. |
| Sliders | Arrow keys, `Home`, `End`, `PgUp`, `PgDn`. |
| Number fields | Type, or `↑` `↓` to step. |
| Alert close, disclosure | `Enter` or `Space`. |
| Save form | `Enter` saves, `Esc` cancels. |

## Testing checklist

Automatic (run `node scripts/audit.mjs`, it needs a running server):

- [ ] No horizontal scroll at 320, 375, 414, 768, 1024, 1280, 1440, 1920, 2560 and 844×390
- [ ] No touch target smaller than 44×44px
- [ ] No axe-core WCAG A or AA violations, on all three tabs
- [ ] `node scripts/check-contrast.mjs` passes

Manual:

- [ ] Use the whole tool with the keyboard only
- [ ] Check the focus ring is visible in light and dark
- [ ] Test with VoiceOver or NVDA: tabs, switch, error messages, toast
- [ ] Zoom the page to 200% and 400%: nothing is cut off
- [ ] Turn on reduced motion: no animation
- [ ] Turn on forced colors (Windows high contrast): controls are still visible
- [ ] Zoom a page that uses the generated `clamp()` to 200%

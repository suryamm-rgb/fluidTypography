# Components

Every component lives in [`src/components/`](../src/components) unless noted. Styles are in [`src/styles/app.css`](../src/styles/app.css) (see [UI-DESIGN.md](UI-DESIGN.md)). Props marked with `?` are optional.

- [Page](#page)
- [Feature components](#feature-components)
- [Shared components](#shared-components)
- [Hooks](#hooks)

## Page

| File | Purpose |
| --- | --- |
| `app/fluid-typography/page.tsx` | Route. Wraps the tool in `Suspense` with `GeneratorSkeleton`. |
| `app/fluid-typography/error.tsx` | Error boundary with a **Try again** button. |
| `FluidTypographyGenerator.jsx` | Reads the URL, validates, calculates, lays out sidebar and tabs. No props. |
| `GeneratorSkeleton.jsx` | Loading state with the same layout. No props. |

## Feature components

| Component | File | Props | Purpose |
| --- | --- | --- | --- |
| `Header` | `Header.jsx` | `title?` | Sticky glass header: logo, GitHub link, theme toggle. Also exports `REPO_URL`. |
| `InputPanel` | `InputPanel.jsx` | `minFont, maxFont, minScreen, maxScreen, rootSize, errors, onChange(patch), reverse, onToggleReverse` | Presets (Body, Heading, Hero, Caption), four linked fields, root size, reverse switch. Exports `PRESETS`. |
| `OutputCard` | `OutputCard.jsx` | `result, minFont, maxFont, minScreen, maxScreen, unit, setUnit, format, setFormat` | rem/px/em tabs, big clamp value, CSS/JSON/Tailwind tabs, copy, download, min/preferred/max stats. |
| `LivePreview` | `LivePreview.jsx` | `rangeMin, rangeMax, minScreen, maxScreen, previewScreen, setPreviewScreen, previewFontSize` | Width slider, resizable frame, font picker (Google fonts load on demand), sample text. |
| `ScaleGraph` | `ScaleGraph.jsx` | `minFont, maxFont, minScreen, maxScreen, rangeMin, rangeMax, previewScreen, setPreviewScreen, previewFontSize, valueAt?, title?, subtitle?, noun?` | SVG chart (flat, diagonal, flat). Marker follows `previewScreen`. Dragging the chart sets it. |
| `FormulaPanel` | `FormulaPanel.jsx` | `minFont, maxFont, minScreen, maxScreen, rootSize` | `<details>` with the four calculation steps. |
| `BreakpointTable` | `BreakpointTable.jsx` | `minFont, maxFont, minScreen, maxScreen` | Table of sizes at 9 screens. Below 40rem it becomes stacked cards. |
| `TypeScale` | `TypeScale.jsx` | `minFont, maxFont, minScreen, maxScreen, rootSize, unit, setUnit, previewScreen, setPreviewScreen, rangeMin, rangeMax` | Ratio chips, custom ratio, line height, sample text, one card per step with copy. |
| `ExportPanel` | `ExportPanel.jsx` | `result, scale, unit, minFont, maxFont, minScreen, maxScreen, format, setFormat` | Whole-scale export with copy and download. |
| `SavedConfigs` | `SavedConfigs.jsx` | `current, unit` | Save, delete and export several settings (in memory). Has an empty state. |
| `AccessibilityWarning` | `AccessibilityWarning.jsx` | `isNegativeVw` | Info alert for reverse scaling and a dismissible zoom warning with links. |
| `DocsPanel` | `DocsPanel.jsx` | none | Short "How it works" guide with a link to these docs. |
| `NumberField` | `NumberField.jsx` | `label, value, onChange, error?, hint?, suffix?, step?, sliderMin?, sliderMax?, sliderLabel?` | Number input with `px` suffix, local draft, inline error, linked slider. |

## Spacing tool and home

| Component | File | Props | Purpose |
| --- | --- | --- | --- |
| `FluidSpacingGenerator` | `FluidSpacingGenerator.jsx` | none | Page for `/fluid-spacing`: property and preset chips, four linked fields, generator, scale and docs tabs, saved list. Settings are local state. |
| `SpacingPreview` | `SpacingPreview.jsx` | `property, px, color` | Padding, margin or gap demo at the current size. |
| Home page | `app/page.tsx` | none | Tool cards. |

`ScaleGraph` is shared: the spacing page passes `valueAt`, `title`, `subtitle` and `noun` to reuse it for spacing.

## Shared components

| Component | File | Props | Purpose |
| --- | --- | --- | --- |
| `Card` | `Card.jsx` | `id?, title?, subtitle?, actions?, as?, className?` | Rounded card with a heading and an actions slot. |
| `Tabs` | `Tabs.jsx` | `items, value, onChange, prefix, label, className?` | WAI-ARIA tab list with arrow, Home and End keys. Exports `tabId` and `panelId`. The parent renders the `role="tabpanel"`. |
| `Alert` | `Alert.jsx` | `variant` (`info`, `warning`, `danger`), `title?, onDismiss?` | Alert with icon. |
| `CodeBlock` | `CodeBlock.jsx` | `code, label, wrap?, large?` | Highlighted code. The `pre` is focusable so it can be scrolled by keyboard. |
| `CopyButton` | `CopyButton.jsx` | `text, label?, copiedLabel?, toast?, variant?, iconOnly?, ariaLabel?, className?` | Copies, shows **Copied!** and a toast. |
| `Toast` | `Toast.jsx` | `ToastProvider` wraps the page. `useToast()` returns `show(text)`. | Live-region toast, 2 seconds. |
| `EmptyState` | `EmptyState.jsx` | `title, children?, tone?` (`empty` or `error`), `small?, action?` | Empty and error messages. |
| `ThemeToggle` | `ThemeToggle.jsx` | none | Button with `aria-pressed`. Both icons are in the DOM and CSS shows one. |
| `Icons` | `Icons.jsx` | `size?, className?` | Inline SVG icons and `LogoMark`. |

## Hooks

| Hook | File | Returns |
| --- | --- | --- |
| `useTheme()` | `useTheme.js` | `{ theme, setTheme, toggle }`. Uses `useSyncExternalStore` on `html[data-theme]`. |
| `useElementSize(ref)` | `useElementSize.js` | `{ width, height }` from a `ResizeObserver`. Used by the graph. |

## Library files (`src/lib`)

| File | Exports |
| --- | --- |
| `exporters.js` | `FORMATS`, `FORMAT_META`, `buildSingle`, `buildScale`, `buildSaved` |
| `validate.js` | `LIMITS`, `validateInputs`, `parseNumber` |
| `spacing.js` | `computeClamp`, `valueAtVw`, `PRESETS`, `PROPERTIES`, `PROPERTY_COLORS`, `validateSpacing` |
| `highlight.js` | `tokenize` |
| `clipboard.js` | `copyText` |
| `download.js` | `downloadText` |

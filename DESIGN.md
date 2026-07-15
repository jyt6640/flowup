# FlowUp Design System

## 0. Research Log

- Embedded refs: shortlisted `notion.md`, `linear.app.md`, and `airbnb.md` → picked `soft-skill.md` + `notion.md` because the brief asks for warm, approachable collaboration with restrained glass surfaces.
- Lazyweb: skipped — no external product screen research was needed because the brief supplies the Questly-inspired layout direction, copy, and image assets.
- Imagen drafts: skipped — the brief already supplies a hero image and a concrete visual direction.
- Layout mechanics: added `layout-skill.md` for the fixed workspace shell, named scroll owner, and responsive panel collapse.
- Static reference packet: Gemini Canvas screenshots supplied by the user → adopted centered hero composition, browser-chrome preview framing, and cropped grass/preview overlap as the landing reference contract.

## 1. Atmosphere & Identity

FlowUp feels like a calm project table set in morning light: warm natural surfaces, precise black actions, and just enough translucency to make the work feel shared. The signature is a soft paper canvas with glass-like collaboration surfaces that keep the next decision visually close at hand.

### Reference Fidelity

- Landing hero keeps navigation over the image, centered Korean display typography, a wide pill input, concise supporting copy, and a compact CTA row.
- Hero display copy is deliberately locked to two semantic lines: `막연한 아이디어를` and `완성된 프로젝트로.`. It must not orphan the final `로.` on a third line.
- The product preview is a dark, browser-shaped plane with a 44px browser chrome row, a narrow left rail, and a quieter content area. Its single outer shell owns the top shadow and ring so the shadow footprint matches the scaled dashboard exactly.
- The preview shell sits behind the grass overlay: dashboard content stays at `z-0` and grass stays at `z-10`.
- The landing first viewport prioritizes the headline and input. The preview is a secondary anchor and may enter the viewport as a partial crop on small laptops.

## 2. Color

### Palette

| Role | Token | Light | Usage |
|---|---|---:|---|
| Canvas | `--surface-canvas` | `#F4F1EA` | Landing and workspace background |
| Surface | `--surface-primary` | `#FBFAF7` | Main content surfaces |
| Surface soft | `--surface-secondary` | `#F0ECE4` | Sidebars, muted panels, input fills |
| Surface elevated | `--surface-elevated` | `#FFFFFF` | Cards, dialogs, preview cores |
| Surface glass | `--surface-glass` | `rgba(255, 255, 255, 0.72)` | Hero navigation and collaboration panels |
| Text primary | `--text-primary` | `#201F1C` | Headings and primary actions |
| Text secondary | `--text-secondary` | `#625F57` | Supporting copy and labels |
| Text tertiary | `--text-tertiary` | `#938D82` | Metadata, placeholders, disabled text |
| Border default | `--border-default` | `#E0D9CE` | Cards and control outlines |
| Border subtle | `--border-subtle` | `rgba(32, 31, 28, 0.08)` | Dividers and quiet framing |
| Accent primary | `--accent-primary` | `#201F1C` | Primary buttons and key actions |
| Accent hover | `--accent-hover` | `#3C3A35` | Hover and pressed action |
| Step idea | `--step-idea` | `#9EBDB1` | Idea exploration |
| Step problem | `--step-problem` | `#D89D7B` | Problem definition |
| Step goal | `--step-goal` | `#A7B9D4` | Project goal |
| Step mvp | `--step-mvp` | `#C2B1D9` | MVP features |
| Step roles | `--step-roles` | `#D6B46E` | Role assignment |
| Step issues | `--step-issues` | `#A9B6B0` | Development issues |
| Status success | `--status-success` | `#5C8566` | Completed states |
| Status warning | `--status-warning` | `#B8793E` | Concentration warnings |
| Status error | `--status-error` | `#B65F57` | Destructive actions |
| Status info | `--status-info` | `#547795` | Informational states |
| Preview canvas | `--preview-canvas` | `#1D211F` | Dark workspace mockup preview only |
| Preview sidebar | `--preview-sidebar` | `#181C1A` | Dark workspace mockup sidebar only |
| Preview main | `--preview-main` | `#222724` | Dark workspace mockup content only |
| Preview brand | `--preview-brand` | `#6558F5` | Purple project identity tile in the workspace preview |

### Rules

- The warm canvas does most of the visual work; color accents are reserved for step identity and semantic status.
- Primary actions stay nearly black so the action hierarchy remains stable across all six steps.
- Use step colors as quiet fills, badges, and borders. Never turn a whole screen into a saturated color block.
- All colors in code must resolve through these tokens.

### Preview Composition

- The fixed mockup design canvas is `896px × 620px`.
- The responsive shell uses `w-[92%] sm:w-[84%] lg:w-[72%] max-w-4xl` and scales the fixed canvas from its measured width.
- The shell uses `shadow-[0_-20px_80px_rgba(0,0,0,0.35)]` and `ring-1 ring-white/10`; the inner dashboard does not add a second shadow.
- The grass overlay is full width, bottom aligned, pointer-events disabled, and visually sits in front of the lower dashboard edge.

## 3. Typography

### Scale

| Level | Size | Weight | Line height | Usage |
|---|---:|---:|---:|---|
| Display | `clamp(2.75rem, 7vw, 5rem)` | 400 | 1.05 | Landing hero |
| H1 | `2rem` | 500 | 1.2 | Workspace and page titles |
| H2 | `1.5rem` | 500 | 1.3 | Section headings |
| H3 | `1.125rem` | 500 | 1.4 | Card and panel titles |
| Body large | `1.125rem` | 400 | 1.6 | Hero supporting copy |
| Body | `0.9375rem` | 400 | 1.55 | Default copy |
| Body small | `0.8125rem` | 400 | 1.45 | Supporting information |
| Caption | `0.6875rem` | 500 | 1.35 | Metadata and overlines |

### Font Stack

- Primary: `'Nimbus Sans TW01', 'Helvetica Neue', Helvetica, Arial, 'Apple SD Gothic Neo', Pretendard, 'Noto Sans KR', sans-serif`
- Mono: `ui-monospace, SFMono-Regular, Menlo, monospace`

### Rules

- Use the supplied Nimbus Sans stylesheet first and preserve a Korean-capable fallback chain.
- Keep display text normal-weight and spacious; use weight only to clarify hierarchy.
- Never use text smaller than `0.8125rem` for meaningful content.
- Letter spacing is `0`; display size is controlled by line-height and measure instead.

## 4. Spacing & Layout

### Base Unit

All spacing derives from a base of **4px**.

| Token | Value | Usage |
|---|---:|---|
| `--space-1` | `4px` | Icon gaps |
| `--space-2` | `8px` | Tight clusters |
| `--space-3` | `12px` | Control padding |
| `--space-4` | `16px` | Standard surface padding |
| `--space-5` | `20px` | Comfortable grouping |
| `--space-6` | `24px` | Card padding |
| `--space-8` | `32px` | Section separation |
| `--space-10` | `40px` | Page rhythm |
| `--space-12` | `48px` | Major section rhythm |
| `--space-16` | `64px` | Landing and workspace breathing room |

### Grid

- Max content width: `1280px`.
- Landing composition: full-bleed hero with a constrained inner column and preview plane.
- Workspace composition: fixed dark sidebar, fluid center, optional context rail.
- Breakpoints: `sm 640px`, `md 768px`, `lg 1024px`, `xl 1280px`.
- Workspace vertical scroll owner: the center content region. Header and sidebar remain fixed within the shell; the right rail collapses below `lg`.

### Rules

- Use CSS grid for the main workspace frame and intrinsic grids for repeated content.
- At widths below `1024px`, the context rail moves below the primary content.
- At widths below `768px`, the sidebar becomes a horizontal step rail and all primary regions become one readable column.
- Never allow a long Korean string or URL to force horizontal scroll; use `overflow-wrap: anywhere`.

## 5. Components

### Logo

- **Structure**: inline SVG mark plus wordmark.
- **Variants**: `light`, `dark`, `compact`.
- **Spacing**: 8px mark-to-wordmark gap.
- **States**: static; inherits current text color.
- **Accessibility**: `aria-label="FlowUp 홈"`.
- **Motion**: none.
- **Layout**: cluster.

### Action Button

- **Structure**: button with optional Lucide icon and label.
- **Variants**: `primary`, `secondary`, `ghost`, `danger`, `icon`.
- **Spacing**: 12px horizontal, 10px vertical; icon gap 8px.
- **States**: default, hover, active, focus, disabled, loading.
- **Accessibility**: native button semantics, visible focus ring, icon-only buttons require `aria-label`.
- **Motion**: 150ms transform/opacity feedback.
- **Layout**: cluster.

### Surface

- **Structure**: tonal or glass wrapper with title/content/footer slots.
- **Variants**: `plain`, `glass`, `elevated`, `muted`.
- **Spacing**: 20px to 24px internal padding.
- **States**: default, selected, empty, error.
- **Accessibility**: surface itself is not interactive; interactive descendants carry focus.
- **Motion**: 200ms background and border transition for selectable surfaces.
- **Layout**: stack; the surface does not own scrolling unless explicitly labeled.

### Step Navigation

- **Structure**: ordered list of step buttons with status markers.
- **Variants**: completed, active, locked.
- **Spacing**: 8px item gap, 12px item padding.
- **States**: default, hover, active, focus, locked.
- **Accessibility**: `aria-current="step"` on the active step; locked items are disabled.
- **Motion**: 200ms color and transform transition.
- **Layout**: stack on desktop, reel on mobile.

### Opinion Card

- **Structure**: author header, answer content, reaction row, optional comment field.
- **Variants**: private, revealed, selected.
- **Spacing**: 20px padding.
- **States**: draft, submitted, revealed, voted, commented.
- **Accessibility**: vote control exposes pressed state; comments use a labeled input.
- **Motion**: 300ms opacity/scale reveal transition.
- **Layout**: stack within an intrinsic grid.

### Feedback Modal

- **Structure**: backdrop, dialog title, score selector, comment field, save action.
- **Variants**: step completion, manual open.
- **Spacing**: 24px padding.
- **States**: open, saving, invalid, saved.
- **Accessibility**: dialog label, focusable close/save controls, escape close.
- **Motion**: 300ms opacity/transform entry; reduced-motion fallback.
- **Layout**: imposter over the workspace shell.

## 6. Motion & Interaction

### Timing

| Type | Duration | Easing | Usage |
|---|---:|---|---|
| Micro | `150ms` | `ease-out` | Button press and toggle |
| Standard | `240ms` | `ease-in-out` | Panel and step changes |
| Emphasis | `520ms` | `cubic-bezier(0.22, 1, 0.36, 1)` | Hero entry and card reveal |

### Rules

- Landing entrance uses `fade-down`, `fade-up`, and `hero-rise` as named in the brief.
- Workspace state changes use opacity and transform only.
- Mock presence indicators may pulse once per cycle to communicate live status; no perpetual decorative motion elsewhere.
- Respect `prefers-reduced-motion: reduce` by disabling non-essential animation.

## 7. Depth & Surface

### Strategy

Use **mixed tonal-shift + soft shadow**. The canvas and sidebar use tonal separation; elevated content uses a low-contrast layered shadow. Hero glass surfaces use a translucent fill, a hairline border, a top highlight, and a backdrop blur fallback.

| Level | Treatment | Usage |
|---|---|---|
| Canvas | `--surface-canvas` | Page background |
| Soft | `--surface-secondary` | Muted grouping and sidebar |
| Glass | `--surface-glass` + blur + hairline | Hero and collaboration context |
| Elevated | `--surface-elevated` + `--shadow-soft` | Cards and dialogs |

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- WCAG target: 2.2 AA.
- Body text targets 4.5:1 contrast; large text targets 3:1.
- Every interactive control has a visible focus ring and keyboard reachability.
- Every icon-only control has an accessible name.
- Korean text must wrap naturally and preserve readable phrase groups.
- Reduced motion disables non-essential animations.

### Accepted Debt

| Item | Location | Why accepted | Owner / Exit |
|---|---|---|---|
| Hero imagery is loaded from the supplied external URL | `src/pages/LandingPage.tsx` | It is part of the prototype brief and keeps the MVP close to the reference mood | Replace with hosted asset before production |
| Dragging uses native HTML5 drag-and-drop rather than a dedicated board library | `src/features/mvp-features/MvpFeaturesStep.tsx` | It keeps the prototype dependency-light and easy to modify during interviews | Replace if touch-first board use is validated |

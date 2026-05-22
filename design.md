# Loud Llamas — Design System

> The source of truth for how the site looks, talks, and behaves. If you're about
> to add a section, write copy, or change a color, read this first.

---

## 1. Brand voice

Loud Llamas is brash, direct, and aggressively anti-agency. The copy reads like
it was written by someone who is genuinely annoyed that marketing agencies
exist.

**Voice rules:**

- Short sentences. Periods over commas when in doubt.
- Outcomes over deliverables. "Google Ads that bring in calls instead of just
  spending your budget" beats "Campaign structure with conversion tracking."
- No corporate hedging. We don't "leverage solutions." We build setups.
- Occasional profanity is fine if it fits. Don't force it.
- "Let The Llamas Decide" is the tone benchmark for warmth and reassurance.
  When a section feels too cold, pull toward that energy.
- The llama is the mascot. The logo (laughing llamas with sunglasses) is the
  only brand illustration we use on the site.

**Voice rules — hard bans:**

- **No em dashes (—) anywhere on the site.** Replace with periods, commas,
  colons, or middle-dots (·). En dashes are fine for numeric ranges like 5–7.
- No "we leverage." No "synergy." No "robust solutions."
- No "world-class," "best-in-class," or anything self-congratulatory.

**Voice rules — keep these phrases:**

- "Pay once. Own it forever."
- "We're not your agency."
- "No retainers. No discovery calls. No 12-month contracts."
- "Agencies charge $2,000/mo to do what Burnrate does overnight."
- "Let The Llamas Decide" (configurator toggle, also a tone marker)
- "Stop renting your marketing. Buy it instead."

---

## 2. Color palette

All colors are referenced as hex literals in Tailwind arbitrary-value syntax,
e.g. `bg-[#2563EB]`. We do not use the default Tailwind palette except for
incidental utilities like `bg-blue-50` and `text-gray-300/400` on dark
backgrounds.

| Token | Hex | Usage |
|---|---|---|
| Primary Blue | `#2563EB` | CTAs, link accents, eyebrows, "most popular" highlight, hover state on black buttons |
| True Black | `#000000` | Body text on light, background of dark sections, primary buttons |
| Near-Black BG | `#0A0A0A` | Burnrate card on packages page (slight separation from `#000000` parent) |
| Dark Gray Border | `#1F2937` | Border on dark-section cards (FounderCounter, Burnrate pricing block) |
| Body Gray | `#6B7280` | Body text on white, subtitles, descriptions |
| Mid Gray | `#9CA3AF` | De-emphasized text (timestamps, helper text, captions) |
| Light Gray Text | `#BEBEBE` | Disabled buttons, placeholder borders |
| Border Light | `#DEDEDE` | Form inputs |
| Border Lighter | `#E5E7EB`, `#EBEBEB` | Card borders, dividers, ticker borders |
| Bg Light | `#F8F8F8` | Alternating section background |
| Bg Lighter | `#F3F4F6`, `#FAFAFA` | Subtle highlight rows, hover state on packages accordion |
| Red | `#DC2626` | Webhook payment-failure alert email banner only. Never used on the site UI. |
| Blue tints (Tailwind) | `blue-50`, `blue-100`, `blue-700` | Selected-state backgrounds, badge backgrounds, link-hover darker shade |
| Dark text on dark | `gray-300`, `gray-400` | Subdued copy inside `bg-[#000000]` sections |

**Rules:**
- Brand blue is the only accent. Never introduce purple, green, or yellow.
- When a section background is black, secondary copy uses `gray-300` (lead) or
  `gray-400` (de-emphasized). Don't use the `#6B7280` body gray on black — it's
  too dark and breaks contrast.
- Section background pattern is **white → F8F8F8 → white → black → white →
  F8F8F8** working down the homepage. Don't put two F8F8F8 sections next to each
  other. The rhythm matters.

---

## 3. Typography

**Font family:** `Geist` (sans-serif), loaded via `next/font/google` in
`app/layout.tsx`. Fallback chain: `Geist, Arial, Helvetica, sans-serif`.

**Type scale — display headlines** (use `clamp()` for fluid sizing):

| Level | Use | Clamp |
|---|---|---|
| Hero H1 | Page hero | `clamp(2rem, 4.5vw, 3.75rem)` to `clamp(2.5rem, 6vw, 4.5rem)` |
| Section H2 (big) | Major section openers | `clamp(2.25rem, 5vw, 4.5rem)` |
| Section H2 (standard) | Most sections | `clamp(2rem, 4vw, 3.5rem)` |
| Subhead | Lead paragraph | `text-lg md:text-xl` |
| Body | Paragraphs | `text-base` or `text-lg` |
| Eyebrow | Section label above H2 | `text-sm font-bold tracking-widest uppercase text-[#2563EB]` |
| Caption | Helper text, timestamps | `text-xs text-[#9CA3AF]` |

**Type scale — UI:**

- Button labels: `text-base font-semibold` (small CTAs) or `font-bold text-lg` (hero/footer CTAs)
- Badges: `text-[10px] font-bold uppercase tracking-widest`
- Tabs/labels: `text-xs font-bold uppercase tracking-widest`

**Headline weight:** Always `font-black` for the big display headlines. Body
text is regular weight; bold only for emphasis within a paragraph.

**Headline leading:** Tight. Use `leading-[0.92]` to `leading-[1.05]` for
display headlines. Body copy is `leading-relaxed`.

**The scribble underline:** For one keyword in a hero, wrap it in:
```tsx
<span className="relative inline-block text-[#2563EB]">
  the keyword
  <svg className="scribble-underline" viewBox="0 0 520 10" preserveAspectRatio="none" aria-hidden="true">
    <polygon points="0,0 520,4 520,6 0,10" fill="#2563EB" />
  </svg>
</span>
```
Use sparingly — once per hero, never twice on the same page. The animation
is defined in `app/globals.css`.

---

## 4. Layout

**Max widths** (used with `mx-auto` to center):

| Container | Use |
|---|---|
| `max-w-7xl` | Marketing sections, hero, full-bleed content |
| `max-w-6xl` | Content-dense sections (packages, resources) |
| `max-w-5xl` | Punchy text-only sections |
| `max-w-4xl` | Problem block, ICP callout |
| `max-w-3xl` | Narrow content (intake form, footer CTA, blog body) |
| `max-w-2xl` | Subhead paragraphs |
| `max-w-xl` | Hero subhead, single-form columns |

**Horizontal padding** (always):
```
px-6 md:px-12 lg:px-20
```
This is the standard container padding. Never deviate without reason.

**Vertical rhythm:**

| Class | Use |
|---|---|
| `py-12` to `py-16` | Tight section (form pages, error states) |
| `py-20` | Standard interior section |
| `py-24` | Major section |
| `py-28` | Hero CTA / closing footer CTA |

**Section pattern (use this template for any new section):**
```tsx
<section className="bg-[#F8F8F8] px-6 md:px-12 lg:px-20 py-24">
  <div className="max-w-7xl mx-auto">
    <p className="text-sm font-bold tracking-widest uppercase text-[#2563EB] mb-4">
      Eyebrow text
    </p>
    <h2 className="font-black text-[#000000] mb-3 leading-[1.0]" style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}>
      Section headline
    </h2>
    <p className="text-[#6B7280] text-lg mb-12">Lead paragraph.</p>
    {/* content */}
  </div>
</section>
```

**Mobile-first:** ICP is a busy small business owner likely on their phone.
Every page must look right at 375px width. Test the hero, packages
accordion, and checkout at that width before shipping.

---

## 5. Components

### Buttons

**Primary CTA (dark on light):**
```
bg-[#000000] text-white font-semibold text-base px-7 py-3.5 rounded-full
hover:bg-[#2563EB] transition-colors duration-300
```

**Primary CTA (blue on dark):**
```
bg-[#2563EB] text-white font-bold text-base px-8 py-4 rounded-full
hover:bg-blue-700 transition-colors duration-300
```

**Secondary CTA (outline on light):**
```
text-[#000000] font-semibold text-base px-7 py-3.5 rounded-full
border border-[#DEDEDE]
hover:border-[#2563EB] hover:text-[#2563EB] transition-colors duration-300
```

**Secondary CTA (outline on dark):**
```
text-white font-semibold text-base px-8 py-4 rounded-full
border border-[#374151]
hover:border-white transition-colors duration-300
```

**Inverted CTA (light on dark, footer CTA pattern):**
```
bg-white text-[#000000] font-bold text-lg px-10 py-4 rounded-full
hover:bg-[#2563EB] hover:text-white transition-colors duration-300
```

**All buttons:** `rounded-full`. We do not use square buttons.

### Badges

**Eyebrow badge (above headline):**
```
text-sm font-bold tracking-widest uppercase text-[#2563EB] mb-4
```

**Inline status badge (custom quote, optional sub, sold out, etc.):**
```
text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded
```
- Blue: `bg-[#2563EB] text-white`
- Black: `bg-[#000000] text-white`
- Light: `bg-blue-50 text-[#2563EB]`
- Gray: `bg-[#F3F4F6] text-[#6B7280]`
- Disabled: `bg-[#E5E7EB] text-[#6B7280]`

### Cards

**Standard card on light bg:**
```
bg-white rounded-2xl p-6 border border-[#EBEBEB]
hover:border-[#2563EB] hover:shadow-lg hover:-translate-y-1
transition-all duration-300
```

**Card on dark bg:**
```
bg-black border border-[#1F2937] rounded-2xl p-6 text-white
```

**Tier card (in packages accordion):**
- Starter: `border-[#E5E7EB]`, badge `bg-[#F3F4F6] text-[#6B7280]`
- Growth: `border-[#2563EB]`, badge `bg-blue-50 text-[#2563EB]`
- Pro: `border-[#000000]`, badge `bg-[#000000] text-white`

### FounderCounter

`components/FounderCounter.tsx`. Props: `count`, `total`, `variant`, `size`.

- Display logic: shows **count (taken)** with label "spots taken", not remaining.
- Progress bar fills proportionally to count/total.
- Always paired with supporting copy: "Only X founder spots left. After that,
  $29/mo standard pricing. No exceptions." (the brand commits to the cap).
- The marketing-staged count is `STATIC_FOUNDER_COUNT = 86` on the homepage,
  /burnrate, and /burnrate/start. The live count is real but currently used
  only as a cap-enforcement signal (in `/api/burnrate/checkout`), not for
  display. Update both when wiring live data in.

### FAQAccordion

`components/FAQAccordion.tsx`. Takes an array of `{ q, a }`. Single-expand:
clicking one closes any other. Centered with `max-w-2xl mx-auto`.

### Packages accordion

`app/packages/PackagesContent.tsx → ChannelBlock`. Single-expand mode (only
one channel open at a time). State held in `expandedSlug: string | null`.
Selecting a tier auto-expands its parent channel.

### Stats bar

Pattern: black background, four stats in a grid, big white numbers, blue
labels.
```tsx
<section className="bg-[#000000] px-6 md:px-12 lg:px-20 py-16">
  <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
    {STATS.map((stat) => (
      <div key={stat.label}>
        <p className="font-black text-white leading-none" style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)" }}>
          {stat.value}
        </p>
        <p className="text-[#2563EB] text-sm mt-2 font-semibold">{stat.label}</p>
      </div>
    ))}
  </div>
</section>
```

### Ticker

Horizontal scrolling marquee. Defined in `app/globals.css` as
`.ticker-track { animation: ticker 30s linear infinite; width: max-content; }`.
Used between sections to break visual rhythm.

---

## 6. Spacing & rhythm

**Inside a section:** Use Tailwind's spacing scale. Common rhythm:
- Eyebrow → `mb-4`
- Headline → `mb-3` to `mb-6`
- Lead paragraph → `mb-8` to `mb-12` (before grid/content)
- Card grid gaps → `gap-4` (compact) or `gap-5` (standard) or `gap-6` (loose)
- Vertical gap between sections within a group → `gap-3` (accordion) up to
  `gap-16` (testimonial grid spacing legacy — prefer `gap-6` going forward)

**Inside a card:**
- Outer padding: `p-5` (compact), `p-6` (standard), `p-8` (feature card)
- Internal spacing: `mb-3` between elements, `mb-6` before the CTA

**Border radius:**
- `rounded-full` — buttons, badges, pills
- `rounded-2xl` — cards
- `rounded-3xl` — large feature cards (founder offer, automation block)
- `rounded-xl` — form inputs, small toggle cards
- Never use `rounded-md` or `rounded-lg`. They look too soft.

---

## 7. Iconography

We use emoji as icons throughout for channels:
- 🌐 Website Build
- 📣 Paid Social Playbook
- 📊 SEM / Google Ads
- 📈 Analytics & Tracking
- 📧 Email / Lifecycle
- ⚡ Automation
- 🦙 The llama (used sparingly, brand moments only)

Checkmarks for benefit lists: `<span className="text-[#2563EB]">✓</span>`.
Never use heroicons or lucide. Emoji + the brand llama logo are the only
visual elements.

---

## 8. Animations

Defined in `app/globals.css`:

- `animate-fade-in` — opacity 0 to 1 over 0.8s ease. Apply `animationDelay`
  inline to stagger.
- `animate-slide-up` — translateY(40px) + opacity 0 to 1 over 0.85s with a
  custom cubic-bezier. Use for hero headline lines.
- `scribble-underline` — the tapered SVG underline beneath a hero keyword.
- `ticker-track` — horizontal infinite scroll for the marquee.

**Hover effects:**
- Cards: `hover:border-[#2563EB] hover:shadow-lg hover:-translate-y-1`
- Buttons: `hover:bg-[#2563EB]` (black → blue) or `hover:bg-blue-700` (blue → darker)
- Links: `hover:text-[#2563EB]` or `hover:underline`
- All hover transitions: `transition-colors duration-300` or
  `transition-all duration-300`

---

## 9. Sectional patterns (the homepage in order)

The homepage establishes the visual rhythm every other page follows. In order:

1. **Hero** — Eyebrow + display H1 (with scribble underline on one keyword) +
   subhead + two CTAs. Logo absolute-positioned right on lg+, hidden on mobile.
2. **Stats bar** — Black bg, four stats, white numbers, blue labels.
3. **ICP callout** — White bg, "This is for you if:" checklist with blue
   checkmarks. Sets buyer expectation.
4. **Ticker** — Horizontal scrolling list of channels and value props.
5. **Problem block** — Big display H2 with gray emphasis on the agency quote
   line, followed by a paragraph that twists the knife.
6. **How it works** — Three numbered steps with blue numbers and top border
   rule.
7. **Package preview** — F8F8F8 bg, 6-card grid with channel name, blurb,
   "from $X" price, optional sub badge, CTA arrow.
8. **Testimonials** — Three-card grid, white bg, marked
   `{/* TODO: REPLACE WITH REAL TESTIMONIALS */}` until real ones land.
9. **Burnrate callout** — Black bg, big H2 with blue accent on key line,
   founder counter on the right. The paid-ads framing is the angle.
10. **Founder offer** — Setup discount card (border-only) next to Burnrate
    founder card (filled black with FounderCounter inside).
11. **Paid social callout** — F8F8F8 bg, "Honest talk about Meta" framing.
12. **FAQ** — Centered, accordion.
13. **Footer CTA** — Black bg, massive headline "Stop renting your marketing.
    Buy it instead." with white + outlined CTAs.

---

## 10. Things that are not allowed

- Mid-page llama illustrations beyond the logo. The bubble-gum llama and the
  outline-llama SVG were both removed deliberately. **Only the logo.**
- Em dashes.
- Multiple "Most Popular" tiers on the same product (one per channel max).
- Section backgrounds that match the section above them (always alternate).
- Stock photos.
- Hero carousels.
- Pop-up modals on landing.
- "Schedule a call" or "Book a demo" CTAs anywhere. We don't do calls.

---

## 11. Accessibility checklist (do before shipping a new section)

- [ ] All interactive elements (buttons, accordions, toggles) have a clear
      hover and focus state.
- [ ] Color contrast: body gray `#6B7280` on white passes WCAG AA. `gray-400`
      on `#000000` is borderline — prefer `gray-300` for any text you want
      readable.
- [ ] Accordion buttons have `aria-expanded` and `aria-controls`.
- [ ] Decorative emoji icons have `aria-hidden="true"` or use semantic
      alternatives.
- [ ] Form inputs have visible labels (no placeholder-only fields).
- [ ] Page H1 is unique. Sections use H2. No skipping levels.

---

## 12. Reference paths

| What | Where |
|---|---|
| Brand colors source of truth | `app/globals.css` (CSS variables) |
| Hero animations | `app/globals.css` |
| Homepage | `app/page.tsx` |
| Packages page (accordion) | `app/packages/PackagesContent.tsx` |
| Burnrate page | `app/burnrate/page.tsx` |
| FounderCounter | `components/FounderCounter.tsx` |
| FAQ accordion | `components/FAQAccordion.tsx` |
| Nav | `components/Nav.tsx` |
| Footer | `components/Footer.tsx` |
| Site metadata, Google verification | `app/layout.tsx` |
| Sitemap | `app/sitemap.ts` |
| Robots | `app/robots.ts` |

---

*Last updated: 2026-05-11*

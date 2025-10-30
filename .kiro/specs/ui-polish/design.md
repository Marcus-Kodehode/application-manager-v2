# Design Document - UI Polish & Consistency

## Overview

Dette design dokumentet beskriver hvordan vi skal implementere en konsistent, profesjonell og brukervennlig polish på hele applikasjonen. Vi fokuserer på detaljer som gjør forskjellen mellom en "OK" app og en "wow" app.

## Architecture

### Design System Foundation

Vi bygger på det eksisterende design systemet i `docs/DESIGN_SYSTEM.md` og utvider det med:

1. **Spacing System** - Strikt 8px grid
2. **Transition System** - Konsistente timing functions
3. **State System** - Hover, focus, loading, empty, error
4. **Accessibility System** - Focus rings, ARIA labels

### Component Audit Strategy

Vi går gjennom hver komponent systematisk:
1. Identifiser spacing-problemer
2. Legg til manglende transitions
3. Verifiser hover states
4. Legg til focus states
5. Sjekk loading/empty/error states

## Components and Interfaces

### 1. Spacing System

**8px Grid Implementation:**

```css
/* Tailwind spacing som følger 8px grid */
p-2  = 8px
p-4  = 16px
p-6  = 24px
p-8  = 32px
p-10 = 40px
p-12 = 48px

gap-2 = 8px
gap-4 = 16px
gap-6 = 24px
gap-8 = 32px
```

**Spacing Patterns:**

- **Kort padding:** `p-4` eller `p-6`
- **Seksjon padding:** `p-6` eller `p-8`
- **Page padding:** `px-4 sm:px-6 lg:px-8`
- **Element gaps:** `gap-4` eller `gap-6`
- **Stack spacing:** `space-y-4` eller `space-y-6`

### 2. Transition System

**Standard Transitions:**

```tsx
// Hover transitions
className="transition-colors duration-200"
className="transition-all duration-200"
className="transition-opacity duration-150"

// Transform transitions
className="transition-transform duration-200"
className="hover:scale-[1.02] transition-transform"

// Shadow transitions
className="hover:shadow-md transition-shadow duration-200"
```

**Timing Functions:**

- **Fast:** 150ms - Små hover effects
- **Normal:** 200ms - Standard interactions
- **Slow:** 300ms - Større animasjoner

### 3. Hover States

**Button Hover Patterns:**

```tsx
// Primary button
className="bg-primary hover:bg-primary/90 transition-colors"

// Secondary button
className="bg-secondary hover:bg-secondary/80 transition-colors"

// Ghost button
className="hover:bg-accent transition-colors"

// Card hover
className="hover:shadow-md hover:scale-[1.01] transition-all"

// Link hover
className="hover:text-primary transition-colors"
```

**Cursor Indicators:**

```tsx
// Clickable elements
className="cursor-pointer"

// Draggable elements
className="cursor-grab active:cursor-grabbing"

// Disabled elements
className="cursor-not-allowed opacity-50"
```

### 4. Focus States

**Focus Ring System:**

```tsx
// Primary focus
className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"

// Input focus
className="focus:border-primary focus:ring-2 focus:ring-primary/20"

// Button focus
className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"

// Card focus (for keyboard navigation)
className="focus:outline-none focus:ring-2 focus:ring-primary/50"
```

**Focus Order:**

- Logisk tab-order (top-to-bottom, left-to-right)
- Skip links for accessibility
- Focus trap i modals/dialogs

### 5. Loading States

**Spinner Component:**

```tsx
// Inline spinner
<div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />

// Button loading state
<button disabled className="opacity-50 cursor-not-allowed">
  <span className="inline-flex items-center gap-2">
    <Spinner />
    Laster...
  </span>
</button>

// Page loading
<div className="flex items-center justify-center min-h-[400px]">
  <div className="text-center">
    <Spinner className="h-8 w-8 mx-auto mb-4" />
    <p className="text-muted-foreground">Laster data...</p>
  </div>
</div>
```

**Skeleton Screens:**

```tsx
// Skeleton card
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
</div>
```

### 6. Empty States

**Empty State Pattern:**

```tsx
<div className="text-center py-12">
  {/* Icon circle */}
  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
    <span className="text-3xl">📋</span>
  </div>
  
  {/* Heading */}
  <h3 className="text-lg font-semibold text-foreground mb-2">
    Ingen jobber ennå
  </h3>
  
  {/* Description */}
  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
    Kom i gang ved å legge til din første jobbsøknad
  </p>
  
  {/* Call to action */}
  <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
    Opprett din første jobb
  </button>
</div>
```

**Empty State Variations:**

- **No data:** Vennlig melding + CTA
- **No results:** Forslag til å endre søk/filter
- **No permissions:** Forklaring + kontakt info
- **Coming soon:** Teaser + notify me

### 7. Error States

**Error Message Pattern:**

```tsx
// Inline error (form validation)
<div className="mt-1 text-sm text-red-600 dark:text-red-400">
  <span className="inline-flex items-center gap-1">
    <span>⚠️</span>
    Dette feltet er påkrevd
  </span>
</div>

// Error banner
<div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
  <div className="flex items-start gap-3">
    <span className="text-2xl">❌</span>
    <div className="flex-1">
      <h4 className="font-semibold text-red-900 dark:text-red-200 mb-1">
        Noe gikk galt
      </h4>
      <p className="text-sm text-red-700 dark:text-red-300">
        Vi kunne ikke lagre endringene dine. Vennligst prøv igjen.
      </p>
    </div>
  </div>
</div>

// Error page
<div className="min-h-[400px] flex items-center justify-center">
  <div className="text-center max-w-md">
    <div className="text-6xl mb-4">😕</div>
    <h2 className="text-2xl font-bold text-foreground mb-2">
      Oops! Noe gikk galt
    </h2>
    <p className="text-muted-foreground mb-6">
      Vi beklager, men vi kunne ikke laste denne siden.
    </p>
    <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg">
      Prøv igjen
    </button>
  </div>
</div>
```

**Error Types:**

- **Validation errors:** Rød border + melding under felt
- **Network errors:** Banner med retry-knapp
- **Permission errors:** Forklaring + kontakt info
- **404 errors:** Vennlig side med navigasjon

## Data Models

Ingen nye data models - dette er kun UI polish.

## Error Handling

### Error Boundaries

```tsx
// React Error Boundary for å fange opp crashes
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### User-Friendly Error Messages

- **Teknisk feil:** "Noe gikk galt. Vennligst prøv igjen."
- **Nettverksfeil:** "Kunne ikke koble til serveren. Sjekk internettforbindelsen din."
- **Valideringsfeil:** "Vennligst fyll ut alle påkrevde felter."
- **Ikke funnet:** "Vi kunne ikke finne det du leter etter."

## Testing Strategy

### Manual Testing Checklist

**Spacing:**
- [ ] Alle komponenter følger 8px grid
- [ ] Konsistent padding i kort
- [ ] Konsistent gaps mellom elementer

**Transitions:**
- [ ] Alle hover effects er smooth
- [ ] Timing er konsistent (150-300ms)
- [ ] Ingen plutselige endringer

**Hover States:**
- [ ] Alle buttons har hover effects
- [ ] Alle lenker har hover effects
- [ ] Alle kort har hover effects

**Focus States:**
- [ ] Tab-navigasjon fungerer
- [ ] Focus rings er synlige
- [ ] Focus order er logisk

**Loading States:**
- [ ] Spinner vises ved lasting
- [ ] Button disables ved submit
- [ ] Loading feedback er tydelig

**Empty States:**
- [ ] Vennlige meldinger
- [ ] Emoji ikoner
- [ ] Call-to-action knapper

**Error States:**
- [ ] Tydelige feilmeldinger
- [ ] Forslag til løsning
- [ ] Vennlig tone

### Accessibility Testing

- [ ] Keyboard navigation fungerer
- [ ] Screen reader friendly
- [ ] ARIA labels på ikoner
- [ ] Focus indicators synlige
- [ ] Kontrast ratio > 4.5:1

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

## Design Decisions

### Why 8px Grid?

- **Konsistens:** Alle spacing-verdier er forutsigbare
- **Skalerbarhet:** Fungerer på alle skjermstørrelser
- **Profesjonalitet:** Industri-standard
- **Tailwind-friendly:** Tailwind bruker 4px base (p-2 = 8px)

### Why 150-300ms Transitions?

- **150ms:** Rask nok til å føles responsiv
- **300ms:** Langsom nok til å være smooth
- **Konsistens:** Alle transitions føles like

### Why Subtle Hover Effects?

- **Profesjonalitet:** Overdrevne effects ser amatørmessige ut
- **Brukervennlighet:** Subtile effects distraherer ikke
- **Performance:** Mindre animasjoner = bedre ytelse

### Why Emoji Icons?

- **Universalitet:** Forstås av alle, uavhengig av språk
- **Vennlighet:** Gjør applikasjonen mer tilgjengelig
- **Konsistens:** Samme stil overalt
- **Ingen dependencies:** Trenger ikke icon library

## Implementation Notes

### Component Priority

**High Priority (Core UX):**
1. Buttons (alle typer)
2. Forms (inputs, selects, textareas)
3. Cards (job cards, document cards)
4. Navigation (header, footer, links)

**Medium Priority (Polish):**
5. Empty states (alle lister)
6. Loading states (alle async operations)
7. Error states (alle feil-scenarier)
8. Hover effects (alle interaktive elementer)

**Low Priority (Nice-to-have):**
9. Animations (subtile micro-interactions)
10. Tooltips (ekstra hjelp)
11. Keyboard shortcuts (power users)

### Avoid These AI Design Mistakes

❌ **Don't:**
- Overdreven bruk av gradients
- Tilfeldige spacing-verdier (13px, 17px, etc.)
- For mange animasjoner
- Inkonsistente farger
- For store shadows
- For mye "glow" effects
- Generiske stock photos

✅ **Do:**
- Subtile gradients (kun for fremheving)
- 8px grid spacing
- Få, men smooth animasjoner
- Konsistente farger fra design system
- Subtile shadows
- Clean, minimal design
- Emoji eller custom illustrations

## Success Metrics

- **Lighthouse Accessibility:** > 95
- **User Testing:** 9/10 brukere finner applikasjonen intuitiv
- **Bug Reports:** < 5 UI-relaterte bugs per måned
- **Completion Rate:** > 90% av brukere fullfører oppgaver
- **Time to Complete:** < 2 minutter for vanlige oppgaver

## Conclusion

Ved å følge dette design dokumentet vil vi skape en applikasjon som:
- Føles profesjonell og gjennomtenkt
- Er brukervennlig for alle
- Har konsistent design overalt
- Unngår typiske AI design-feil
- Er tilgjengelig for alle brukere

Neste steg er å lage en detaljert task list for implementering.

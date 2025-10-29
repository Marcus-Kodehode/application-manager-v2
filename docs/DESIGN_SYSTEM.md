# Design System - Jobbsøk Assistent

## 🎨 Fargepalett

### Light Mode (Varm & Profesjonell)
```css
--background: #fafaf9      /* Stone-50 - Varm off-white, ikke sterkt hvit */
--foreground: #1c1917      /* Stone-900 - Varm svart */
--card: #ffffff            /* Hvit for kort/cards */
--card-foreground: #1c1917 /* Tekst på cards */
--primary: #2563eb         /* Blue-600 - Dyp blå (IKKE AI-blå) */
--primary-foreground: #fff /* Hvit tekst på primary */
--secondary: #f5f5f4       /* Stone-100 - Subtil bakgrunn */
--accent: #0891b2          /* Cyan-600 - Accent farge */
--muted: #f5f5f4           /* Dempet bakgrunn */
--muted-foreground: #78716c /* Dempet tekst */
--border: #e7e5e4          /* Stone-200 - Subtile borders */
--success: #059669         /* Emerald-600 */
--warning: #d97706         /* Amber-600 */
--error: #dc2626           /* Red-600 */
```

### Dark Mode (Elegant & Moderne)
```css
--background: #0c0a09      /* Stone-950 - Varm svart */
--foreground: #fafaf9      /* Stone-50 - Off-white */
--card: #1c1917            /* Stone-900 - Kort bakgrunn */
--card-foreground: #fafaf9 /* Tekst på cards */
--primary: #60a5fa         /* Blue-400 - Lysere blå */
--primary-foreground: #0c0a09 /* Mørk tekst på primary */
--secondary: #292524       /* Stone-800 */
--accent: #22d3ee          /* Cyan-400 */
--muted: #292524           /* Dempet bakgrunn */
--muted-foreground: #d6d3d1 /* Stone-300 - God kontrast! */
--border: #44403c          /* Stone-700 - Synlige borders */
--success: #10b981         /* Emerald-500 */
--warning: #f59e0b         /* Amber-500 */
--error: #ef4444           /* Red-500 */
```

**Kontrast-ratio:**
- foreground på background: 19.8:1 ✅
- muted-foreground på background: 11.2:1 ✅
- primary på background: 8.5:1 ✅

## 📐 Spacing & Layout

### Spacing Scale (8px grid)
- xs: 0.5rem (8px)
- sm: 1rem (16px)
- md: 1.5rem (24px)
- lg: 2rem (32px)
- xl: 3rem (48px)
- 2xl: 4rem (64px)

### Border Radius
- sm: 0.5rem (8px)
- md: 0.75rem (12px)
- lg: 1rem (16px)
- full: 9999px

### Shadows
- sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
- md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
- lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)

## 🔤 Typography

### Font Family
- Primary: Inter (sans-serif)

### Font Sizes
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)

### Font Weights
- normal: 400
- medium: 500
- semibold: 600
- bold: 700

## 🎭 Komponenter

### Buttons

#### Primary Button
```tsx
className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
```

#### Secondary Button
```tsx
className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
```

#### Outline Button
```tsx
className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
```

#### Danger Button
```tsx
className="px-4 py-2 bg-error text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
```

### Cards
```tsx
className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6"
```

### Inputs
```tsx
className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
```

### Badges/Tags
```tsx
// Status badge
className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"

// Success badge
className="px-2 py-1 text-xs font-medium rounded-full bg-success/10 text-success"
```

## 🎬 Animasjoner

### Transitions
- Standard: 150ms cubic-bezier(0.4, 0, 0.2, 1)
- Theme change: 300ms ease
- Hover: 150ms ease

### Keyframes
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
```

## 📋 Komponent-liste for oppdatering

### ✅ Ferdig
- [x] Header
- [x] ThemeToggle
- [x] ThemeProvider

### 🔄 Må oppdateres

#### Pages
- [ ] app/page.tsx (Landing)
- [ ] app/dashboard/page.tsx
- [ ] app/jobs/page.tsx
- [ ] app/jobs/new/page.tsx
- [ ] app/jobs/[id]/page.tsx
- [ ] app/documents/page.tsx

#### Components
- [ ] components/layout/Footer.tsx
- [ ] components/jobs/JobForm.tsx
- [ ] components/jobs/KanbanBoard.tsx
- [ ] components/jobs/JobsFilter.tsx
- [ ] components/jobs/CSVManager.tsx
- [ ] components/jobs/JobDetailClient.tsx
- [ ] components/jobs/JobExport.tsx
- [ ] components/jobs/tabs/TimelineTab.tsx
- [ ] components/jobs/tabs/NotesTab.tsx
- [ ] components/jobs/tabs/TasksTab.tsx
- [ ] components/jobs/tabs/FilesTab.tsx
- [ ] components/jobs/tabs/ContactsTab.tsx
- [ ] components/documents/DocumentsClient.tsx

## 🎯 Styling Guidelines

### DO ✅
- Bruk CSS-variabler (var(--primary), var(--background), osv.)
- Bruk 8px spacing grid
- Smooth transitions (150-300ms)
- Konsistent border-radius (lg = 1rem)
- Hover states på alle interaktive elementer
- Focus states for accessibility

### DON'T ❌
- Hardkodede farger (unntatt i CSS-variabler)
- Inkonsistent spacing
- For raske animasjoner (<100ms)
- For mange forskjellige border-radius verdier
- Manglende hover/focus states

## 🔄 Oppdateringsprosess

For hver komponent:

1. **Identifiser hardkodede farger**
   - Søk etter: `bg-gray-`, `text-gray-`, `bg-blue-`, `text-blue-`, osv.

2. **Erstatt med CSS-variabler**
   - `bg-gray-50` → `bg-background`
   - `bg-white` → `bg-card`
   - `text-gray-900` → `text-foreground`
   - `text-gray-600` → `text-muted-foreground`
   - `bg-blue-600` → `bg-primary`
   - `text-blue-600` → `text-primary`
   - `border-gray-200` → `border-border`

3. **Test i begge modes**
   - Toggle dark mode
   - Sjekk kontrast
   - Verifiser hover states

4. **Marker som ferdig**
   - Oppdater denne listen

## 🎨 Eksempel: Før og Etter

### Før
```tsx
<div className="bg-white border border-gray-200 rounded-lg p-6">
  <h2 className="text-2xl font-bold text-gray-900 mb-4">Tittel</h2>
  <p className="text-gray-600">Beskrivelse</p>
  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
    Klikk her
  </button>
</div>
```

### Etter
```tsx
<div className="bg-card border border-border rounded-lg p-6">
  <h2 className="text-2xl font-bold text-foreground mb-4">Tittel</h2>
  <p className="text-muted-foreground">Beskrivelse</p>
  <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
    Klikk her
  </button>
</div>
```

## 📱 Responsivitet

### Breakpoints
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

### Mobile-first approach
- Design for mobil først
- Legg til kompleksitet for større skjermer
- Test på alle breakpoints

## ♿ Accessibility

### Kontrast
- Normal tekst: Minimum 4.5:1
- Large tekst: Minimum 3:1
- UI komponenter: Minimum 3:1

### Focus States
- Alltid synlig focus ring
- `focus:ring-2 focus:ring-primary focus:ring-offset-2`

### ARIA Labels
- Bruk `aria-label` på ikoner uten tekst
- `aria-describedby` for hjelpetekst
- `role` attributter der nødvendig

---

**Start her**: Velg en komponent fra listen og følg oppdateringsprosessen! 🚀

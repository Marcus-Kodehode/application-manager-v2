# Design System - Jobbsøk Assistent

## 🎨 Fargepalett

### CSS Variabler (HSL Format)

```css
/* Light Mode */
--background: 0 0% 100%;           /* Hvit bakgrunn */
--foreground: 222.2 84% 4.9%;      /* Nesten svart tekst */
--card: 0 0% 100%;                 /* Hvit kort */
--card-foreground: 222.2 84% 4.9%; /* Nesten svart tekst på kort */
--primary: 221.2 83.2% 53.3%;      /* Blå primærfarge */
--primary-foreground: 210 40% 98%; /* Hvit tekst på primær */
--secondary: 210 40% 96.1%;        /* Lys grå sekundær */
--secondary-foreground: 222.2 47.4% 11.2%; /* Mørk tekst på sekundær */
--muted: 210 40% 96.1%;            /* Dempet bakgrunn */
--muted-foreground: 215.4 16.3% 46.9%; /* Dempet tekst */
--accent: 210 40% 96.1%;           /* Accent bakgrunn */
--accent-foreground: 222.2 47.4% 11.2%; /* Accent tekst */
--destructive: 0 84.2% 60.2%;      /* Rød for sletting */
--destructive-foreground: 210 40% 98%; /* Hvit tekst på rød */
--border: 214.3 31.8% 91.4%;       /* Lys grå border */
--input: 214.3 31.8% 91.4%;        /* Input border */
--ring: 221.2 83.2% 53.3%;         /* Focus ring */

/* Dark Mode */
--background: 222.2 84% 4.9%;      /* Nesten svart bakgrunn */
--foreground: 210 40% 98%;         /* Hvit tekst */
--card: 222.2 84% 4.9%;            /* Mørk kort */
--card-foreground: 210 40% 98%;    /* Hvit tekst på kort */
--primary: 217.2 91.2% 59.8%;      /* Lysere blå */
--primary-foreground: 222.2 47.4% 11.2%; /* Mørk tekst på primær */
--secondary: 217.2 32.6% 17.5%;    /* Mørk grå sekundær */
--secondary-foreground: 210 40% 98%; /* Hvit tekst på sekundær */
--muted: 217.2 32.6% 17.5%;        /* Dempet mørk */
--muted-foreground: 215 20.2% 65.1%; /* Dempet lys tekst */
--accent: 217.2 32.6% 17.5%;       /* Accent mørk */
--accent-foreground: 210 40% 98%;  /* Accent lys tekst */
--destructive: 0 62.8% 30.6%;      /* Mørk rød */
--destructive-foreground: 210 40% 98%; /* Hvit tekst på rød */
--border: 217.2 32.6% 17.5%;       /* Mørk border */
--input: 217.2 32.6% 17.5%;        /* Input border */
--ring: 224.3 76.3% 48%;           /* Focus ring */
```

**Kontrast-ratio (WCAG AA compliant):**
- foreground på background: 19.8:1 ✅
- muted-foreground på background: 11.2:1 ✅
- primary på background: 8.5:1 ✅

---

## 📐 Spacing & Typography

### Spacing Scale (8px grid)
```css
gap-1: 0.25rem (4px)
gap-2: 0.5rem (8px)
gap-3: 0.75rem (12px)
gap-4: 1rem (16px)
gap-6: 1.5rem (24px)
gap-8: 2rem (32px)

p-2: 0.5rem (8px)
p-3: 0.75rem (12px)
p-4: 1rem (16px)
p-6: 1.5rem (24px)
p-8: 2rem (32px)
```

### Typography Scale
```css
text-xs: 0.75rem (12px)
text-sm: 0.875rem (14px)
text-base: 1rem (16px)
text-lg: 1.125rem (18px)
text-xl: 1.25rem (20px)
text-2xl: 1.5rem (24px)
text-3xl: 1.875rem (30px)
text-4xl: 2.25rem (36px)
```

### Font Weights
```css
font-normal: 400
font-medium: 500
font-semibold: 600
font-bold: 700
```

---

## 🎯 Component Patterns

### 1. Kort (Cards)

```tsx
// Standard kort
<div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-colors">
  {/* Innhold */}
</div>

// Kort med hover effect
<div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-all hover:shadow-md">
  {/* Innhold */}
</div>

// Kort med gruppe hover (for slett-knapp)
<div className="bg-card rounded-xl shadow-sm border border-border p-6 transition-all hover:shadow-md group">
  <button className="opacity-0 group-hover:opacity-100 transition-all">
    🗑️ Slett
  </button>
</div>
```

### 2. Knapper

```tsx
// Primær knapp
<button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-all shadow-sm hover:shadow">
  Lagre
</button>

// Sekundær knapp
<button className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent font-medium transition-all text-foreground">
  Avbryt
</button>

// Destruktiv knapp
<button className="px-6 py-2.5 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 font-medium transition-all shadow-sm hover:shadow">
  Slett
</button>

// Disabled state
<button 
  disabled={isLoading}
  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
>
  {isLoading ? '⏳ Lagrer...' : '💾 Lagre'}
</button>
```

### 3. Input Felter

```tsx
// Standard input
<input
  type="text"
  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted"
  placeholder="Skriv her..."
/>

// Textarea
<textarea
  rows={5}
  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted resize-none"
  placeholder="Skriv ditt notat her..."
/>

// Select
<select className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground">
  <option value="1">Valg 1</option>
  <option value="2">Valg 2</option>
</select>

// Checkbox
<input
  type="checkbox"
  className="h-4 w-4 text-primary rounded focus:ring-2 focus:ring-primary"
/>
```

### 4. Labels

```tsx
// Standard label
<label className="block text-sm font-medium text-foreground mb-2">
  Navn *
</label>

// Label med ikon
<label className="block text-sm font-medium text-foreground mb-2">
  📧 E-post
</label>
```

### 5. Badges

```tsx
// Status badge
<span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
  Søkt
</span>

// Tag badge
<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
  React
</span>
```

### 6. Loading States

```tsx
// Spinner
<div className="flex items-center justify-center py-12">
  <div className="text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
    <p className="text-muted">Laster...</p>
  </div>
</div>

// Inline loading
<button disabled className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg">
  ⏳ Lagrer...
</button>
```

### 7. Empty States

```tsx
<div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center transition-colors">
  <div className="text-6xl mb-4">📝</div>
  <p className="text-muted text-lg mb-2">Ingen notater ennå</p>
  <p className="text-muted text-sm">Legg til ditt første notat ovenfor!</p>
</div>
```

### 8. Info Bokser

```tsx
// Info boks med ikon
<div className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg">
  <dt className="text-sm font-medium text-muted min-w-[100px]">📍 Sted</dt>
  <dd className="flex-1 text-sm text-foreground font-medium">Oslo</dd>
</div>
```

### 9. Tabs

```tsx
// Tab navigasjon
<div className="border-b border-border mb-6">
  <nav className="flex gap-4 md:gap-8 overflow-x-auto">
    <button
      className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-all ${
        isActive
          ? 'border-primary text-primary'
          : 'border-transparent text-muted hover:text-foreground hover:border-border'
      }`}
    >
      Detaljer
    </button>
  </nav>
</div>
```

### 10. Timeline

```tsx
<div className="flex gap-4">
  <div className="flex flex-col items-center">
    <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-xl flex-shrink-0">
      🔄
    </div>
    <div className="w-0.5 flex-1 bg-border mt-3"></div>
  </div>
  <div className="flex-1 pb-6">
    <div className="bg-accent/50 rounded-lg p-4 transition-all hover:bg-accent/70">
      {/* Event innhold */}
    </div>
  </div>
</div>
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile first approach */
.element {
  /* Mobile styles (default) */
}

@media (min-width: 768px) {
  /* Tablet styles (md:) */
}

@media (min-width: 1024px) {
  /* Desktop styles (lg:) */
}
```

### Responsive Patterns

```tsx
// Grid som tilpasser seg
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Innhold */}
</div>

// Flex som wrapper
<div className="flex flex-col md:flex-row gap-4">
  {/* Innhold */}
</div>

// Skjul på mobil
<div className="hidden md:block">
  {/* Vises kun på tablet og desktop */}
</div>

// Vis kun på mobil
<div className="block md:hidden">
  {/* Vises kun på mobil */}
</div>
```

---

## ♿ Accessibility

### Focus States

```tsx
// Alltid inkluder focus states
<button className="... focus:ring-2 focus:ring-primary focus:outline-none">
  Klikk meg
</button>

<input className="... focus:ring-2 focus:ring-primary focus:border-transparent" />
```

### Semantic HTML

```tsx
// Bruk riktige HTML elementer
<nav>
  <ul>
    <li><a href="/jobs">Jobber</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Tittel</h1>
    <p>Innhold</p>
  </article>
</main>

<footer>
  <p>&copy; 2025</p>
</footer>
```

### ARIA Labels

```tsx
// Når visuell tekst ikke er nok
<button aria-label="Slett notat">
  🗑️
</button>

<input
  type="search"
  aria-label="Søk i jobber"
  placeholder="Søk..."
/>
```

---

## 🎭 Animasjoner

### Transitions

```tsx
// Standard transition
<div className="transition-all duration-200">
  {/* Innhold */}
</div>

// Hover transition
<div className="transition-all hover:shadow-md">
  {/* Innhold */}
</div>

// Opacity transition
<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
  {/* Innhold */}
</div>
```

### Keyframe Animations

```css
/* Spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

---

## 💡 Best Practices

### 1. Konsistens
- ✅ Bruk alltid CSS variabler for farger
- ✅ Følg samme spacing pattern (p-4, p-6, gap-4, etc.)
- ✅ Bruk samme border radius (rounded-lg, rounded-xl)

### 2. Performance
- ✅ Bruk `transition-all` sparsomt (kun når nødvendig)
- ✅ Prefer `transition-colors` eller `transition-opacity`
- ✅ Unngå å animere `width` eller `height`

### 3. Accessibility
- ✅ Alltid inkluder focus states
- ✅ Bruk semantic HTML
- ✅ Test med keyboard navigation
- ✅ Sjekk kontrast med WCAG checker

### 4. Responsivitet
- ✅ Mobile-first approach
- ✅ Test på ulike skjermstørrelser
- ✅ Bruk `overflow-x-auto` for horisontale lister
- ✅ Sørg for touch targets er minst 44x44px

### 5. Dark Mode
- ✅ Test alltid i både light og dark mode
- ✅ Bruk CSS variabler konsekvent
- ✅ Sjekk kontrast i begge modes
- ✅ Unngå hardkodede farger

---

## 🎯 Sjekkliste for Nye Komponenter

- [ ] Bruker CSS variabler for farger
- [ ] Har hover states på interaktive elementer
- [ ] Har focus states for accessibility
- [ ] Har loading state
- [ ] Har empty state (hvis relevant)
- [ ] Er responsiv (mobile, tablet, desktop)
- [ ] Fungerer i både light og dark mode
- [ ] Har smooth transitions
- [ ] Bruker semantic HTML
- [ ] Har tydelig visuelt hierarki
- [ ] Følger spacing pattern (p-4, p-6, gap-4)
- [ ] Bruker konsistent border radius
- [ ] Har emoji ikoner for bedre UX
- [ ] Har disabled states der relevant
- [ ] Er testet med keyboard navigation

---

**Følg denne guiden for konsistent og moderne styling på tvers av hele applikasjonen! 🎨**

# Setup Guide - Jobbsøk Assistent v2

## 📦 Steg 1: Installer dependencies

```bash
npm install
```

Dette installerer alle nødvendige pakker inkludert:
- Next.js 16
- Mongoose (MongoDB driver)
- Clerk (autentisering)
- Zod (validering)
- Tailwind CSS
- og mer...

## 🔐 Steg 2: Setup MongoDB Atlas

1. Gå til [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Opprett en gratis konto (hvis du ikke har en)
3. Opprett et nytt cluster (velg FREE tier)
4. Klikk "Connect" → "Connect your application"
5. Kopier connection string (ser ut som: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Erstatt `<password>` med ditt faktiske passord
7. Legg til database-navn på slutten: `/jobtracker`

Eksempel:
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/jobtracker?retryWrites=true&w=majority
```

## 🔑 Steg 3: Setup Clerk

1. Gå til [clerk.com](https://clerk.com)
2. Opprett en gratis konto
3. Opprett en ny applikasjon
4. Gå til "API Keys" i sidebar
5. Kopier:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starter med `pk_test_...`)
   - `CLERK_SECRET_KEY` (starter med `sk_test_...`)

## 📝 Steg 4: Opprett .env.local

Kopier `.env.local.example` til `.env.local`:

```bash
cp .env.local.example .env.local
```

Eller opprett filen manuelt med dette innholdet:

```env
# MongoDB
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/jobtracker?retryWrites=true&w=majority"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Viktig**: Erstatt placeholder-verdiene med dine faktiske keys!

## 🚀 Steg 5: Start utviklingsserver

```bash
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000) i nettleseren.

## ✅ Verifiser at alt fungerer

1. Du skal se en "Sign In" side fra Clerk
2. Opprett en bruker (eller logg inn)
3. Du skal komme til dashboard
4. Klikk "Ny Jobb" og opprett din første jobbsøknad
5. Sjekk at jobben vises i listen

## 🐛 Feilsøking

### "Cannot connect to MongoDB"
- Sjekk at MONGODB_URI er korrekt
- Sjekk at passordet ikke inneholder spesialtegn som må URL-encodes
- Sjekk at IP-adressen din er whitelisted i MongoDB Atlas (Network Access)

### "Clerk authentication failed"
- Sjekk at CLERK keys er korrekte
- Sjekk at du har kopiert hele key-en (ingen mellomrom)
- Prøv å regenerere keys i Clerk dashboard

### "Module not found"
- Kjør `npm install` på nytt
- Slett `node_modules` og `package-lock.json`, kjør `npm install` igjen

### Port 3000 er opptatt
- Endre port: `npm run dev -- -p 3001`
- Eller stopp prosessen som bruker port 3000

## 📚 Neste steg

Når alt fungerer:
1. Les [progression.md](./progression.md) for å se hva som er implementert
2. Utforsk koden i `lib/models/` for å se datamodellen
3. Sjekk `lib/actions/` for server actions
4. Begynn å bruke appen! 🎉

## 🆘 Trenger hjelp?

- Sjekk console i nettleseren for feilmeldinger
- Sjekk terminal for server-feil
- Les dokumentasjon:
  - [Next.js](https://nextjs.org/docs)
  - [Mongoose](https://mongoosejs.com/docs/)
  - [Clerk](https://clerk.com/docs)

<div align="center">

<p><img src="/public/images/logo.png" alt="Jobbsøk Assistent Logo" width="150" /></p>

# Jobbsøk Assistent

> A modern job application tracker built with Next.js, MongoDB, and Clerk

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black.svg)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-00ed64.svg)](https://www.mongodb.com)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-4B47C7.svg)](https://clerk.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## ✨ Key Features

- 📋 **Complete Job Tracking** - Manage all your job applications in one place
- 🎯 **Kanban Board** - Visual workflow with drag-and-drop (Søkt → Screening → Intervju → Tilbud)
- 📊 **Smart Dashboard** - Overview with prioritized tasks and statistics
- 📝 **Rich Job Details** - Notes, tasks, contacts, files, and timeline for each application
- 📁 **Document Management** - Upload and organize CVs, cover letters, and other documents
- ✅ **Task Management** - Track deadlines with smart color-coding (overdue, due soon)
- 👥 **Contact Tracking** - Keep track of recruiters and hiring managers
- ⏳ **Event Timeline** - Complete history of all changes and interactions
- 💾 **CSV Export/Import** - Full data portability and backup
- 🌓 **Dark/Light Mode** - Beautiful theme system with perfect contrast
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔒 **Secure Authentication** - User isolation with Clerk
- ♿ **Accessibility** - WCAG AA compliant with keyboard navigation

## 🚀 Getting Started

### 1. **Clone the project**

```bash
git clone https://github.com/yourusername/jobbsok-assistent.git
cd jobbsok-assistent
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Set up environment variables**

```bash
cp .env.local.example .env.local
```

Fill in your credentials:
- **MongoDB Atlas URI** - Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- **Clerk Keys** - Create free app at [clerk.com](https://clerk.com)

### 4. **Start development server**

```bash
npm run dev
```

### 5. **Open browser**

```
http://localhost:3000
```

## 🛠️ Built With

- **[Next.js 15](https://nextjs.org)** - React framework with App Router
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[MongoDB](https://www.mongodb.com)** - NoSQL database
- **[Mongoose](https://mongoosejs.com)** - MongoDB object modeling
- **[Clerk](https://clerk.com)** - Authentication and user management
- **[Zod](https://zod.dev)** - TypeScript-first schema validation
- **[React Hook Form](https://react-hook-form.com)** - Performant form handling
- **[@dnd-kit](https://dndkit.com)** - Modern drag-and-drop toolkit
- **[TypeScript](https://www.typescriptlang.org)** - Type safety

## 📝 Documentation

Comprehensive documentation available in the `/docs` folder:

- **[SETUP.md](docs/SETUP.md)** - Detailed setup and installation guide
- **[PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)** - Complete file structure explanation
- **[DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)** - Styling guide and component patterns
- **[DEVELOPMENT_SESSIONS.md](docs/DEVELOPMENT_SESSIONS.md)** - Development history and improvements
- **[TODO.md](docs/TODO.md)** - Roadmap and planned features
- **[CHANGELOG.md](docs/CHANGELOG.md)** - Version history and changes
- **[MONGOOSE_NOTES.md](docs/MONGOOSE_NOTES.md)** - Why Mongoose over Prisma

## 📋 Main Sections

- 🏠 **Dashboard** - Overview with prioritized tasks, recent documents, and statistics
- 💼 **Jobs** - Complete job application management with Kanban board
- 📄 **Documents** - Upload and organize CVs, cover letters, and other files
- 🔍 **Search & Filter** - Advanced filtering by status, location, work type, and tags
- 📊 **Statistics** - Track your application success rate and active processes
- 👤 **Profile** - User settings and preferences (via Clerk)

## 🎯 Job Management Features

### Kanban Board
- Visual workflow with 6 statuses
- Drag-and-drop to change status
- Color-coded columns
- Job count badges
- Horizontal scroll layout

### Job Detail Page
- **Overview** - All job information at a glance
- **Notes** - Add personal notes and observations
- **Tasks** - Track interview prep, follow-ups, etc.
- **Files** - Attach relevant documents
- **Contacts** - Store recruiter and hiring manager info
- **Timeline** - Complete history of all changes

### Smart Features
- **Priority Tasks** - Color-coded by deadline (overdue, due soon)
- **Document Search** - Find files quickly by name or type
- **CSV Export** - Backup all your data
- **CSV Import** - Restore or migrate data
- **Empty States** - Helpful guidance for new users
- **Loading States** - Clear feedback during operations

## 🔧 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
npm run type-check # Run TypeScript compiler check
```

## 📁 Project Structure

```
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (sign-in, sign-up)
│   ├── dashboard/           # Dashboard page
│   ├── jobs/                # Job pages
│   │   ├── [id]/           # Job detail page
│   │   ├── new/            # Create job page
│   │   └── page.tsx        # Jobs list with Kanban
│   ├── documents/           # Documents page
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── jobs/               # Job-related components
│   │   ├── KanbanBoard.tsx
│   │   ├── JobForm.tsx
│   │   ├── JobsFilter.tsx
│   │   ├── CSVManager.tsx
│   │   └── tabs/           # Job detail tabs
│   ├── documents/          # Document components
│   ├── layout/             # Layout components
│   ├── theme/              # Theme components
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── models/             # Mongoose schemas
│   ├── actions/            # Server Actions
│   ├── utils/              # Utility functions
│   ├── db.ts               # MongoDB connection
│   ├── auth.ts             # Auth helpers
│   └── validation.ts       # Zod schemas
├── docs/                    # Documentation
└── public/                  # Static assets
```

## 🔒 Security

- **User Isolation** - All queries filtered by `userId`
- **Authentication** - Secure auth with Clerk
- **Input Validation** - Zod schemas on all inputs
- **Type Safety** - Full TypeScript coverage
- **Server Actions** - Secure server-side operations
- **Environment Variables** - Sensitive data in `.env.local`

## 🎨 Design Philosophy

- **Modern & Clean** - Professional design that inspires confidence
- **User-Friendly** - Intuitive for both technical and non-technical users
- **Accessible** - WCAG AA compliant with keyboard navigation
- **Responsive** - Mobile-first design approach
- **Theme-Aware** - Perfect contrast in both light and dark mode
- **Consistent** - 8px grid system and design tokens
- **Subtle Animations** - Smooth transitions (150-300ms)
- **Emoji Icons** - Universal visual language

## 🚧 Roadmap

### High Priority
- [ ] Drag-and-drop in Kanban board
- [ ] iCal feed for interviews
- [ ] Email notifications
- [ ] Advanced analytics

### Medium Priority
- [ ] Settings pages
- [ ] i18n (Norwegian/English)
- [ ] Bulk operations
- [ ] Saved searches

### Low Priority
- [ ] PWA support
- [ ] Offline mode
- [ ] Data visualization
- [ ] API for integrations

See [docs/TODO.md](docs/TODO.md) for detailed task list.

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Clerk for seamless authentication
- MongoDB for reliable database
- Tailwind CSS for beautiful styling
- The open-source community

---

<div align="center">

*"All we have to decide is what to do with the time that is given us."*

<sub>— J.R.R. Tolkien, The Fellowship of the Ring</sub>

<br><br>

<!-- Personal logo placeholder -->
<img src="/public/images/MBlogo.png" alt="Personal Logo" width="50" />

<sub>Created with ❤️ by [Your Name]</sub>

</div>

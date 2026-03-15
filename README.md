# Smart Website Platform

## แพลตฟอร์มเว็บไซต์อัจฉริยะ สำหรับองค์กรปกครองส่วนท้องถิ่น

Smart Website Platform is a modern, multi-tenant content management system designed specifically for Thai local government organizations (เทศบาล, อบจ., อบต.). Built with Next.js, it provides a complete solution for managing municipal websites with Thai-language support, citizen services, and AI-powered features.

## Features

- **Multi-tenant Architecture** - Single deployment serves multiple government organizations, each with custom branding, domain, and content
- **Content Management** - News, announcements, pages, banners, photo galleries, and document management with bilingual (Thai/English) support
- **Procurement Module** - Publish and manage government procurement notices (จัดซื้อจัดจ้าง) with full lifecycle tracking
- **Citizen Complaint System** - Online complaint submission with tracking numbers, status updates, and assignment workflow
- **Contact Form** - Public contact submission with admin management and reply tracking
- **Document Downloads** - Categorized document repository with download counters
- **Visitor Analytics** - Built-in visitor logging and statistics
- **Role-based Access Control** - Super Admin, Admin, Editor, and Viewer roles
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **SEO Optimized** - Dynamic meta tags, sitemaps, and structured data
- **AI Integration** - AI-powered chatbot for citizen inquiries and content assistance

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: SQLite (development) / PostgreSQL (production) via [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with Credentials provider
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Prompt](https://fonts.google.com/specimen/Prompt) Thai font
- **Icons**: [Lucide React](https://lucide.dev/)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npm run db:generate
npm run db:push
```

5. Seed the database with sample data:
```bash
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Admin Account

- **Email**: admin@smartcity.go.th
- **Password**: admin123

## Project Structure

```
smart-website/
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.ts               # Database seed script
│   └── prisma.ts             # Prisma client instance
├── src/
│   ├── app/                  # Next.js App Router pages
│   ├── components/           # Reusable React components
│   ├── context/              # React context providers
│   ├── hooks/                # Custom React hooks
│   ├── i18n/                 # Internationalization config
│   ├── lib/
│   │   ├── auth.ts           # NextAuth configuration
│   │   └── utils.ts          # Utility functions
│   ├── styles/               # Global styles
│   ├── types/                # TypeScript type definitions
│   └── middleware.ts         # Next.js middleware (auth guards)
├── public/                   # Static assets
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Multi-Tenant Configuration

Each tenant (government organization) has its own:

- **Branding**: Custom colors, logo, favicon, and font
- **Content**: Independent news, pages, announcements, and documents
- **Users**: Separate user accounts with role-based permissions
- **Settings**: Configurable operating hours, contact info, map coordinates, and SEO

### Adding a New Tenant

1. Create a new tenant record in the database with a unique slug and optional custom domain
2. Create an admin user associated with the tenant
3. Configure site settings (SiteConfig) for the tenant
4. Set up menu items for the tenant's navigation

Tenants are identified by their slug in the URL path or by custom domain mapping.

## AI Integration

The platform includes AI-powered features:

- **Citizen Chatbot**: An AI assistant that helps citizens find information, navigate services, and submit inquiries
- **Content Suggestions**: AI-assisted content creation for news articles and announcements
- **Auto-categorization**: Automatic categorization of complaints and contact submissions
- **Smart Search**: AI-enhanced search across all content types

AI features can be enabled or disabled per tenant via the `chatbot_enabled` site configuration.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset and re-seed database |

## License

MIT

# uniLLM Frontend

A modern, responsive frontend for the German Student Info Chatbot built with SvelteKit, providing an intuitive chat interface for students seeking information about studying in Germany.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Overview

The uniLLM frontend is built using:

- **SvelteKit** - Modern web framework for building fast, efficient applications
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Prisma** - Database ORM for chat history and user management
- **Shadcn/ui** - Reusable UI components

## Features

✅ **Current Features:**

- Clean, ChatGPT-like interface
- Real-time chat messaging
- Chat history persistence
- Responsive design for mobile and desktop
- Dark/light theme support
- TypeScript support throughout

🚧 **Upcoming Features:**

- User authentication
- Chat session management
- CV upload functionality
- Advanced search filters
- Multi-language support

## Prerequisites

- Node.js 18+ and npm
- Access to the uniLLM backend service
- PostgreSQL database (for chat history)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/rissalhedna/unillm.git
cd unillm-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables by creating a `.env` file:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/postgres"
DIRECT_URL="postgresql://postgres:postgres@127.0.0.1:5432/postgres"

# Backend API
VITE_API_URL="http://127.0.0.1:8000"

# Qdrant (if needed for direct access)
QDRANT_URL="http://127.0.0.1:6333"
```

4. Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

## Development

### Starting the Development Server

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

The application will be available at `http://127.0.0.1:5173`

### Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run Svelte checks
- `npm run check:watch` - Run Svelte checks in watch mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Code Quality

The project includes:

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type checking
- Svelte-check for Svelte-specific checks

## Building

To create a production version of the app:

```bash
npm run build
```

You can preview the production build with:

```bash
npm run preview
```

## Configuration

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection string for chat history
- `DIRECT_URL` - Direct database connection for Prisma
- `VITE_API_URL` - Backend API endpoint
- `QDRANT_URL` - Qdrant vector database URL (optional)

### Prisma Schema

The application uses Prisma for database management. Key models include:

- `Chat` - Chat sessions
- `Message` - Individual messages
- `User` - User information (future implementation)

## Project Structure

```
src/
├── lib/
│   ├── components/    # Reusable Svelte components
│   │   ├── ui/       # Shadcn/ui components
│   │   └── chat/     # Chat-specific components
│   ├── utils.ts      # Utility functions and state management
│   └── types/        # TypeScript type definitions
├── routes/           # SvelteKit routes
│   ├── api/         # API routes
│   └── +page.svelte # Main chat interface
├── app.html         # HTML template
└── app.css          # Global styles
```

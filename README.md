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
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/postgres"

# Backend API
VITE_API_URL="http://localhost:8000"

# Qdrant (if needed for direct access)
QDRANT_URL="http://localhost:6333"
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

The application will be available at `http://localhost:5173`

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
│   ├── stores/       # Svelte stores for state management
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
├── routes/           # SvelteKit routes
│   ├── api/         # API routes
│   └── +page.svelte # Main chat interface
├── app.html         # HTML template
└── app.css          # Global styles
```

### Key Components

- **ChatInterface** - Main chat container
- **MessageBubble** - Individual message display
- **InputArea** - Message input with send button
- **ChatHistory** - Sidebar for previous conversations
- **LoadingIndicator** - Shows when waiting for responses

## API Integration

The frontend communicates with the backend through:

### Chat API

- `POST /api/chat` - Send new message
- `GET /api/chats` - Retrieve chat history
- `GET /api/chats/[id]` - Get specific chat

### WebSocket Support (Planned)

- Real-time message streaming
- Live typing indicators
- Connection status updates

## Styling

The application uses:

- **Tailwind CSS** for utility-based styling
- **CSS Variables** for theme customization
- **Responsive Design** with mobile-first approach
- **Dark/Light Theme** support

### Custom Theme

Modify the theme by updating CSS variables in `app.css`:

```css
:root {
  --primary: #3b82f6;
  --secondary: #64748b;
  --background: #ffffff;
  --foreground: #0f172a;
}
```

## Deployment

### Netlify (Recommended)

1. Build the project:

```bash
npm run build
```

2. Deploy the `build` folder to Netlify

### Vercel

1. Install Vercel adapter:

```bash
npm install -D @sveltejs/adapter-vercel
```

2. Update `svelte.config.js` to use Vercel adapter

3. Deploy with Vercel CLI or GitHub integration

### Static Deployment

For static deployment, use the static adapter:

```bash
npm install -D @sveltejs/adapter-static
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run check && npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing component structure
- Add JSDoc comments for complex functions
- Ensure responsive design compatibility
- Test on multiple browsers and devices

## Troubleshooting

### Common Issues

**Database Connection Error:**

- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Run `npx prisma migrate dev`

**Backend Connection Failed:**

- Verify VITE_API_URL points to running backend
- Check CORS settings in backend
- Ensure backend is accessible from frontend

**Build Errors:**

- Run `npm run check` to identify TypeScript issues
- Clear `node_modules` and reinstall dependencies
- Check for unused imports or variables

## License

This project is licensed under the MIT License.

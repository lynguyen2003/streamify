# Streamify Frontend

## Overview

Streamify is a modern social media platform that allows users to share posts, follow other users, like and comment on content, and more. This repository contains the frontend application built with React, TypeScript, and Vite.

## Features

- **User Authentication**: Sign up, sign in, and password recovery
- **Profile Management**: View and update user profiles
- **Social Interactions**: Follow users, like posts, and comment on content
- **Content Creation**: Create and share posts with media
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Redux Toolkit with Redux Persist
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with Zod validation
- **API Communication**: Apollo Client (GraphQL) and TanStack Query
- **UI Components**: Radix UI primitives
- **File Uploads**: React Dropzone

## Project Structure

```
streamify/
├── public/              # Static assets
│   └── assets/          # Icons and images
├── src/
│   ├── components/      # UI components
│   │   ├── forms/       # Form components
│   │   ├── shared/      # Shared components
│   │   └── ui/          # UI primitives
│   ├── constants/       # Application constants
│   ├── context/         # React context providers
│   ├── features/        # Feature-specific code
│   ├── graphql/         # GraphQL queries and mutations
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Page layouts
│   ├── lib/             # Utility libraries
│   ├── pages/           # Page components
│   ├── routes/          # Routing configuration
│   ├── store/           # Redux store setup
│   └── types/           # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000

### Building for Production

```bash
npm run build
```

This will generate optimized production files in the `dist` directory.

## Docker Support

The application can be containerized using Docker:

```bash
docker build -t streamify-frontend .
docker run -p 3000:80 streamify-frontend
```

Or use Docker Compose to run the entire stack (frontend, API, and Redis):

```bash
docker-compose up
```

## Environment Variables

- `VITE_GRAPHQL_URL`: URL for the GraphQL API endpoint (default: http://localhost:4000/graphql)

## New Dependencies

This project requires the following additional dependencies:

- `@radix-ui/react-dialog`: For creating accessible dialog components
- `lucide-react`: For icons in the dialog components

To install these dependencies, run:

```bash
npm install @radix-ui/react-dialog lucide-react
```

## License

ISC

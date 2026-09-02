# RuralConnect

A comprehensive platform connecting rural agricultural stakeholders for seamless resource sharing, service delivery, and economic growth.

## Overview

RuralConnect bridges the gap between farmers, contractors, equipment owners, workers, suppliers, and service providers in rural areas. The platform enables efficient resource allocation, skill matching, and service delivery through a multi-role marketplace.

## Key Features

- **Multi-Role System**: Farmers, Contractors, Tractor Owners, Workers, Equipment Owners, Suppliers
- **Matching Engine**: AI-powered matching between service providers and customers
- **Work Requests & Bookings**: Post jobs and manage work sessions
- **Integrated Payments**: Secure payment handling and dispute resolution
- **Ratings & Verification**: Trust-building through verified profiles and ratings
- **Real-time Notifications**: Instant updates on requests, bookings, and messages

## Project Structure

- **apps/web** - Next.js web application for desktop/tablet users
- **apps/api** - NestJS backend API
- **apps/mobile** - Mobile application (React Native/Flutter)
- **packages/** - Shared libraries (database, types, validation, matching engine, UI)
- **docs/** - Product vision, architecture, and decisions
- **tests/** - Unit, integration, and E2E tests
- **scripts/** - Database and data management scripts

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: NestJS, Node.js, TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Real-time**: WebSockets (for notifications/messaging)
- **Authentication**: JWT + OAuth (Google, phone OTP)
- **Deployment**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Docker & Docker Compose (optional)

### Quick Setup

```bash
# Install dependencies
npm install

# Setup database
npm run db:setup

# Run development environment
npm run dev

# Run API
npm run dev:api

# Run Web
npm run dev:web
```

## Documentation

- [Product Vision](./docs/product/vision.md)
- [Phase 1 Scope](./docs/product/phase-1-scope.md)
- [Architecture](./docs/architecture/architecture.md)
- [Database Design](./docs/architecture/database-design.md)
- [Architecture Decision Records](./docs/decisions/)

## Contributing

See CONTRIBUTING.md for guidelines.

## License

See LICENSE file for details.

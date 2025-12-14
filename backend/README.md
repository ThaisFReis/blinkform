# BlinkForm Backend

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  Backend API for <a href="https://github.com/your-repo/blinkform">BlinkForm</a>, a no-code visual builder for creating Solana Blinks (Actions) with an intuitive drag-and-drop interface.
</p>

![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)
![Solana](https://img.shields.io/badge/Solana-9945FF?logo=solana&logoColor=white)

## Description

This is the backend API server for BlinkForm, built with [NestJS](https://nestjs.com/) framework. It provides RESTful endpoints for form management, Solana Actions integration, and transaction processing.

## Features

- **Form Management**: Create, update, and manage forms with persistent storage
- **Solana Actions**: Integration with Solana Actions and Blinks protocol
- **Transaction Support**: Handle Solana transactions with signature validation
- **Schema Parsing**: Process and validate form schemas
- **Database Integration**: PostgreSQL with Prisma ORM
- **Caching**: Redis support for performance optimization

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **Language**: TypeScript
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/) ORM
- **Cache**: Redis (optional)
- **Blockchain**: [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)

## Project Structure

```
backend/
├── src/
│   ├── actions/         # Solana Actions endpoints
│   ├── forms/           # Form CRUD operations
│   ├── prisma/          # Database configuration
│   ├── redis/           # Cache service
│   ├── root/            # Health check & actions.json
│   ├── schema-parser/   # Form schema processing
│   └── solana/          # Solana transaction builder
├── prisma/
│   └── schema.prisma    # Database schema
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis (optional, for caching)
- Solana CLI (for development)

### Installation

```bash
$ npm install
```

### Environment Configuration

Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/blinkform"

# Supabase (optional)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# Solana
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Server
PORT=3001
```

### Database Setup

1. **Install Prisma CLI** (if not already installed)
   ```bash
   npm install -g prisma
   ```

2. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

### Compile and run the project

```bash
# development
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

This application is configured for deployment on [Vercel](https://vercel.com).

### Prerequisites
- Vercel account
- PostgreSQL database (Vercel Postgres or external)
- Redis (Vercel Redis or external, optional)

### Environment Variables
Set the following environment variables in your Vercel project:

- `DATABASE_URL`: Your PostgreSQL connection string
- `SUPABASE_URL`: Your Supabase project URL (optional)
- `SUPABASE_ANON_KEY`: Your Supabase anon key (optional)
- `REDIS_HOST`: Redis host (if using Redis)
- `REDIS_PORT`: Redis port (if using Redis)
- `SOLANA_RPC_URL`: Solana RPC endpoint
- `PORT`: Port for the application (usually 3000)

### Deployment Steps

1. **Connect to Vercel**:
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Login to Vercel
   vercel login
   ```

2. **Deploy**:
   ```bash
   # Link your project
   vercel link

   # Deploy
   vercel --prod
   ```

3. **Database Setup**:
   Vercel will automatically run the build scripts which include:
   - Generating Prisma client
   - Running database migrations

### Production URLs

- **Production API**: https://blinkform-backend.vercel.app
- **Actions Manifest**: https://blinkform-backend.vercel.app/actions.json

For more deployment options, check out the [NestJS deployment documentation](https://docs.nestjs.com/deployment).

## API Reference

### Base URL
```
http://localhost:3001/api
```

### Forms Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/forms` | Create a new form |
| `GET` | `/forms/:id` | Get form by ID |
| `PUT` | `/forms/:id` | Update form |
| `GET` | `/forms?creator=address` | Get forms by creator |

### Actions Endpoints (Solana)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/actions/:formId` | Get Solana Action metadata |
| `POST` | `/actions/:formId` | Submit form via Solana Action |

### System Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/actions.json` | Solana Actions manifest |

For complete API documentation, see the main [README.md](../README.md).

## Resources

- [BlinkForm Main Documentation](../README.md) - Full project overview and setup
- [NestJS Documentation](https://docs.nestjs.com) - Learn about the NestJS framework
- [Prisma Documentation](https://www.prisma.io/docs) - Database ORM documentation
- [Solana Documentation](https://docs.solana.com/) - Solana blockchain documentation
- [Dialect Blinks](https://github.com/dialectlabs/blinks) - Blinks protocol implementation

## Troubleshooting

### Common Issues

- **Database Connection Failed**: Ensure PostgreSQL is running and `DATABASE_URL` is correct.
- **Redis Connection Error**: Check Redis host/port or disable Redis if not needed.
- **Solana RPC Errors**: Verify `SOLANA_RPC_URL` is accessible.
- **Build Failures**: Run `npm install` and ensure all dependencies are installed.

For more help, check the [Testing Guide](../TESTING_GUIDE.md) or create an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

# BlinkForm

A no-code visual builder for creating Solana Blinks (Actions) with an intuitive drag-and-drop interface. Build complex transaction flows, forms, and interactive experiences without writing code.

## Status

⚠️ **Note**: This dapp is not fully complete, and the blink has not been registered yet.

![BlinkForm](https://img.shields.io/badge/BlinkForm-Solana-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)

## Table of Contents

- [Status](#-status)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Development](#️-development)
- [Deployment](#-deployment)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)
- [Support](#-support)

## 🚀 Features

- **Visual Flow Builder**: Drag-and-drop interface for creating complex transaction flows
- **Solana Integration**: Native support for Solana Actions and Blinks protocol
- **No-Code Experience**: Build sophisticated forms and transactions without programming
- **Mobile Responsive**: Fully responsive design with mobile-optimized preview
- **Real-time Preview**: See your forms in action on mobile devices
- **Node-Based Architecture**: Modular components for inputs, transactions, NFTs, and more
- **Form Management**: Create, update, and manage forms with persistent storage
- **Transaction Support**: Handle Solana transactions with signature validation

## 📸 Screenshots

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/081310df-a18f-4f0a-8d97-e4bde5236097" />

## 🛠️ Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **Language**: TypeScript
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/) ORM
- **Cache**: Redis (optional)
- **Blockchain**: [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- **Storage**: [Supabase](https://supabase.com/) (optional)

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Flow Builder**: [React Flow](https://reactflow.dev/) (xyflow)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons**: [Phosphor Icons](https://phosphoricons.com/)
- **Blinks**: [@dialectlabs/blinks](https://github.com/dialectlabs/blinks)

## 📁 Project Structure

```
blinkform/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── actions/         # Solana Actions endpoints
│   │   ├── forms/           # Form CRUD operations
│   │   ├── prisma/          # Database configuration
│   │   ├── redis/           # Cache service
│   │   ├── root/            # Health check & actions.json
│   │   └── schema-parser/   # Form schema processing
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
├── frontend/                # Next.js application
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   ├── components/      # React components
│   │   │   ├── nodes/       # Flow builder node types
│   │   │   └── sidebars/    # Builder sidebars
│   │   ├── store/           # Zustand state management
│   │   └── types/           # TypeScript type definitions
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis (optional, for caching)
- Solana CLI (for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blinkform
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Configuration

Create a `.env` file in the `backend/` directory with the following variables:

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
   cd backend
   npx prisma migrate deploy
   npx prisma generate
   ```

### Running the Application

1. **Start the Backend** (Development)
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Start the Frontend** (Development)
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📖 Usage

### Creating a Form

1. **Open the Builder**: Navigate to `/builder` in your browser
2. **Add Nodes**: Drag nodes from the left sidebar onto the canvas
3. **Connect Nodes**: Draw connections between nodes to define flow
4. **Configure Properties**: Use the right sidebar to configure node properties
5. **Preview**: Use the mobile preview to see how your form looks on devices
6. **Save**: Your form is automatically saved to the database

### Available Node Types

- **Input Node**: Text, number, and other input fields
- **Choice Node**: Multiple choice selections
- **Date Node**: Date and time pickers
- **Transaction Node**: Solana transaction execution
- **Mint NFT Node**: NFT minting operations
- **Call Contract Node**: Smart contract interactions
- **Conditional Node**: Logic branching
- **Calculation Node**: Mathematical operations
- **Validation Node**: Input validation
- **End Node**: Form completion
- **Start Node**: The starting point of the form with title, description, and optional image
- **Batch Airdrop Node**: For batch airdropping tokens to multiple recipients
- **Create NFT Collection Node**: For creating NFT collections with name, symbol, royalty, and URI
- **Create Token Node**: For creating new tokens with name, symbol, supply, decimals, and URI
- **Mint Token Node**: For minting tokens to a recipient

### Form Submission

Forms can be submitted through:
- **Web Interface**: Direct form filling at `/form/[id]`
- **Solana Actions**: Integration with Solana wallets and dApps
- **API**: Programmatic submission via REST API

### API Usage Example

Create a new form via API:

```bash
curl -X POST http://localhost:3001/api/forms \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Form",
    "description": "A test form",
    "schema": {
      "type": "object",
      "properties": {
        "name": {"type": "string"},
        "email": {"type": "string", "format": "email"}
      }
    }
  }'
```

## 🔌 API Reference

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

## 🏗️ Development

### Backend Scripts

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod

# Testing
npm run test
npm run test:watch
npm run test:cov

# Database
npm run db:migrate
npm run db:generate

# Linting
npm run lint
```

### Frontend Scripts

```bash
# Development
npm run dev

# Build
npm run build
npm run start

# Testing
npm run test
npm run test:watch
npm run test:coverage

# Linting
npm run lint
```

### Code Quality

- **ESLint**: Configured for both backend and frontend
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking
- **Jest**: Unit and integration testing

## 🚀 Deployment

### Backend Deployment

The backend is configured for deployment on [Vercel](https://vercel.com/):

1. **Environment Variables**: Set all required environment variables in Vercel
2. **Database**: Use Vercel's PostgreSQL service or external database
3. **Redis**: Use Vercel's Redis service or external Redis (optional)
4. **Build Command**: `npm run build`
5. **Start Command**: `npm run start:prod`

### Frontend Deployment

The frontend can be deployed on [Vercel](https://vercel.com/):

1. **Build Settings**: Next.js detects automatically
2. **Environment Variables**: Set `NEXT_PUBLIC_API_URL` for API endpoint
3. **Domain**: Configure custom domain if needed

### Production URLs

- **Production API**: https://blinkform-backend.vercel.app
- **Actions Manifest**: https://blinkform-backend.vercel.app/actions.json

## 🔧 Troubleshooting

### Common Issues

- **Database Connection Failed**: Ensure PostgreSQL is running and `DATABASE_URL` is correct.
- **Redis Connection Error**: Check Redis host/port or disable Redis if not needed.
- **Solana RPC Errors**: Verify `SOLANA_RPC_URL` is accessible.
- **Build Failures**: Run `npm install` in both backend and frontend directories.
- **Port Conflicts**: Change `PORT` in backend `.env` if 3001 is in use.

For more help, check the [Testing Guide](TESTING_GUIDE.md) or create an issue.


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Solana Labs](https://solana.com/) for the Solana blockchain
- [Dialect Labs](https://dialect.to/) for the Blinks protocol
- [React Flow](https://reactflow.dev/) for the flow builder foundation
- [NestJS](https://nestjs.com/) for the robust backend framework

## 📞 Support

For questions and support:
- Create an issue on GitHub
- Join our Discord community
- Check the documentation

---

Built with ❤️ for the Solana ecosystem

# BlinkForm Project Context

## Project Overview

BlinkForm is a no-code visual interface for creating stateful, multi-step blockchain interactions (Blinks) on Solana. It enables creators to build interactive forms, surveys, KYC flows, and gated payments that can be embedded directly into social feeds using Solana Actions and Blinks.

**Mission**: Democratize the creation of stateful, context-aware blockchain interactions through a visual, no-code interface.

## Core Principles

1. **Schema-Driven**: The backend is a generic runtime engine; all logic is defined by JSON Schema stored in the database
2. **Ephemeral State**: User sessions are short-lived and cached in Redis to maintain "state" over the stateless HTTP protocol
3. **Security by Design**: All transactions are simulated before generation; strict validation on all inputs

## Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL (Supabase)
- **Cache**: Redis (for session management)
- **Blockchain**: Solana Web3.js
- **RPC**: Helius for transaction simulation

### Frontend
- **Framework**: Next.js
- **Graph Builder**: react-flow-renderer
- **State Management**: Zustand
- **Blink Preview**: @dialectlabs/blinks SDK

## Architecture

### Data Flow
1. **Creator** builds a form using the visual graph builder (React Flow)
2. **Schema** is saved as JSON in PostgreSQL
3. **Runtime Engine** reads schema and executes logic based on user interactions
4. **Redis** maintains ephemeral session state during multi-step flows
5. **Solana** transactions are generated for on-chain actions

### Key Components

#### Database Schema (PostgreSQL)
- `forms` table: Stores form definitions with JSON schema
- `submissions` table: Stores completed form submissions with transaction signatures

#### Session Management (Redis)
- Key pattern: `session:{form_id}:{user_account}`
- TTL: 15 minutes
- Stores current node ID and answer history

#### Logic Graph (JSON)
The JSON schema defines:
- **Nodes**: Question nodes, transaction nodes, logic nodes
- **Edges**: Connections between nodes with conditional logic
- **Start Node**: Entry point for the form

## API Structure

### GET /api/actions/:formId
- Initializes the Blink
- Returns ActionGetResponse with first step
- Checks for existing session

### POST /api/actions/:formId
- Handles user input
- Updates session state in Redis
- Returns next step or transaction
- Query params: `?next_node=node_id&answer=value`

## Development Roadmap

### Phase 1: Core Engine
- Backend setup with NestJS, Supabase, Redis
- Generic GET handler implementation
- Basic linear flow (Step 1 → Step 2 → End)
- State persistence verification

### Phase 2: The Builder
- Next.js frontend with React Flow
- Question and End node types
- Schema persistence
- Blink simulator with Dialect SDK

### Phase 3: Transaction & Logic
- TransactionFactory implementation
- Conditional edges (branching logic)
- Helius RPC integration for simulation

### Phase 4: Polish & Registry
- Signature verification
- Custom OG image generation
- Vercel deployment
- Dialect registry submission

## Important Concepts

### Solana Actions & Blinks
- **Actions**: Blockchain transactions embedded in shareable links
- **Blinks**: Blockchain Links that unfurl in social feeds
- **Context-Based Interaction**: Users interact without leaving their timeline

### Node Types
- **Question Node**: Text input, multiple choice
- **Transaction Node**: Mint NFT, transfer tokens, swap
- **Logic Node**: Conditional branching

### State Management
- Sessions are keyed by `{form_id}:{user_account}`
- State transitions happen on each POST request
- Final state is persisted in PostgreSQL

## Security Considerations

- All transactions are simulated before generation
- Input validation on all fields
- Signature verification for transaction requests
- Session validation (reject if signer changes mid-stream)

## Edge Cases

- **Stateless HTTP**: Session ID passed in query params or derived from User_Pubkey + Form_ID
- **Transaction Size Limits**: Aggregate in Redis, commit final hash to Arweave or Memo instruction
- **Wallet Switching**: Reject requests if signer changes (403 Forbidden)

## File Structure Expectations

```
/
├── backend/           # NestJS API
│   ├── src/
│   │   ├── actions/   # Action handlers (GET/POST)
│   │   ├── forms/     # Form CRUD
│   │   ├── transactions/ # TransactionFactory
│   │   └── sessions/  # Redis session management
├── frontend/          # Next.js UI
│   ├── components/
│   │   ├── GraphBuilder/ # React Flow editor
│   │   └── Simulator/    # Blink preview
│   └── pages/
│       └── api/       # API routes
└── database/
    └── migrations/    # SQL schema
```

## Development Guidelines

- Always read existing code before proposing changes
- Keep solutions simple and focused on current requirements
- Avoid over-engineering or adding unnecessary features
- Use schema-driven approach for all form logic
- Test state persistence across multiple requests
- Simulate transactions before returning to users

## References

- [Solana Actions & Blinks Guide](https://www.quicknode.com/guides/solana-development/transactions/actions-and-blinks)
- [Solana Actions Spec](https://github.com/solana-developers/solana-actions/blob/main/packages/actions-spec/index.d.ts)
- [Dialect Blinks Client SDK](https://medium.com/dialect-labs/introducing-the-blinks-client-sdk-8bf0e3474349)
- [Blinks Public Registry](https://medium.com/dialect-labs/introducing-the-blinks-public-registry-fa103bca2852)

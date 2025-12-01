# BlinkForm Development Task List

## Overview
Comprehensive, prioritized task list for the BlinkForm project - a no-code visual interface for creating stateful, multi-step blockchain interactions (Blinks) on Solana.

## Project Phases and Tasks

### Phase 1: Core Engine Setup - Establish foundational backend infrastructure
- [ ] Set up Supabase PostgreSQL database connection and environment variables
- [ ] Configure Redis connection for session management with TTL
- [ ] Implement basic Prisma service integration in NestJS modules
- [ ] Create Form and Submission models with proper relationships
- [ ] **Testing:** Write unit tests for Prisma service and database models
- [ ] Implement basic GET /api/actions/:formId endpoint with form validation
- [ ] **Testing:** Write unit tests for GET endpoint and form validation logic
- [ ] Add session management logic using Redis for state persistence
- [ ] **Testing:** Write unit tests for Redis service and session management
- [ ] Create basic ActionGetResponse structure following Solana Actions spec
- [ ] **Testing:** Write unit tests for ActionGetResponse structure compliance
- [ ] Implement POST /api/actions/:formId endpoint for handling user input
- [ ] **Testing:** Write unit tests for POST endpoint input handling
- [ ] Add session hydration from Redis in POST handler
- [ ] **Testing:** Write integration tests for session hydration functionality
- [ ] Implement basic linear flow logic (Step 1 -> Step 2 -> End)
- [ ] **Testing:** Write unit tests for linear flow logic and state transitions
- [ ] Add input validation for current node type
- [ ] **Testing:** Write unit tests for input validation rules
- [ ] Update Redis session with user answers
- [ ] **Testing:** Write integration tests for session updates and persistence
- [ ] Return NextActionLink for inline question rendering
- [ ] **Testing:** Write unit tests for NextActionLink generation
- [ ] Test basic flow with curl commands to verify state persistence
- [ ] **Testing:** Write end-to-end tests for complete flow using test database

### Phase 2: Builder Interface Development - Create visual form builder
- [ ] Set up Next.js project with TypeScript and Tailwind CSS
- [ ] Install and configure React Flow (@xyflow/react) for graph visualization
- [ ] **Testing:** Write unit tests for React Flow configuration and basic rendering
- [ ] Create custom QuestionNode component with input fields and handles
- [ ] **Testing:** Write unit tests for QuestionNode component rendering and interactions
- [ ] Create custom TransactionNode component with transaction type selection
- [ ] **Testing:** Write unit tests for TransactionNode component and form validation
- [ ] Implement Zustand store for managing graph state locally
- [ ] **Testing:** Write unit tests for Zustand store state management and actions
- [ ] Add drag-and-drop functionality for nodes in GraphBuilder
- [ ] **Testing:** Write integration tests for drag-and-drop interactions
- [ ] Implement edge creation and management between nodes
- [ ] **Testing:** Write unit tests for edge creation, deletion, and validation
- [ ] Create form to input question text and options for QuestionNode
- [ ] **Testing:** Write component tests for question form inputs and validation
- [ ] Add transaction parameter forms (amount, mint address, etc.) for TransactionNode
- [ ] **Testing:** Write component tests for transaction parameter forms
- [ ] Implement save functionality to persist graph schema to backend
- [ ] **Testing:** Write integration tests for save functionality and API calls
- [ ] Create API endpoint to save/update form schema in database
- [ ] **Testing:** Write API tests for form schema CRUD operations
- [ ] Integrate Dialect Blinks SDK in BlinkSimulator component
- [ ] **Testing:** Write unit tests for Blinks SDK integration
- [ ] Implement iframe-based preview pointing to local API for WYSIWYG feedback
- [ ] **Testing:** Write integration tests for iframe preview functionality
- [ ] Add mock runtime engine for simulator testing
- [ ] **Testing:** Write unit tests for mock runtime engine behavior

### Phase 3: Advanced Logic and Transactions - Add branching and blockchain integration
- [ ] Implement TransactionFactory class using Solana Web3.js
- [ ] **Testing:** Write unit tests for TransactionFactory class and transaction building
- [ ] Add support for SPL token mint transactions
- [ ] **Testing:** Write integration tests for SPL token mint transaction creation
- [ ] Add support for SOL transfer transactions
- [ ] **Testing:** Write integration tests for SOL transfer transaction creation
- [ ] Integrate Helius RPC for transaction simulation before user signing
- [ ] **Testing:** Write integration tests for Helius RPC transaction simulation
- [ ] Implement conditional edge logic for branching workflows
- [ ] **Testing:** Write unit tests for conditional edge evaluation logic
- [ ] Add logic node types for conditional branching (if/then/else)
- [ ] **Testing:** Write unit tests for logic node types and branching behavior
- [ ] Update schema parser to handle conditional edges
- [ ] **Testing:** Write unit tests for schema parser with conditional edges
- [ ] Implement branching logic in POST handler based on user answers
- [ ] **Testing:** Write integration tests for branching logic in POST handler
- [ ] Add transaction simulation endpoint for security validation
- [ ] **Testing:** Write API tests for transaction simulation endpoint
- [ ] Implement proper ActionPostResponse for transaction nodes
- [ ] **Testing:** Write unit tests for ActionPostResponse structure compliance
- [ ] Add error handling for invalid transactions or insufficient funds
- [ ] **Testing:** Write error handling tests for transaction validation failures

### Phase 4: Polish, Security, and Deployment - Production readiness
- [ ] Implement signature verification for all transaction requests
- [ ] **Testing:** Write security tests for signature verification and validation
- [ ] Add wallet address validation and session security checks
- [ ] **Testing:** Write security tests for wallet address validation and session integrity
- [ ] Create loading states and progress indicators in UI
- [ ] **Testing:** Write UI tests for loading states and user feedback
- [ ] Implement custom OG image generation for each form step
- [ ] **Testing:** Write integration tests for OG image generation and social sharing
- [ ] Add form validation and error handling throughout the application
- [ ] **Testing:** Write comprehensive error handling tests and validation tests
- [ ] Implement proper CORS configuration for cross-origin requests
- [ ] **Testing:** Write integration tests for CORS configuration and cross-origin functionality
- [ ] Set up Vercel deployment for frontend and API routes
- [ ] **Testing:** Write deployment verification tests and CI/CD pipeline tests
- [ ] Configure Supabase production database
- [ ] **Testing:** Write database migration tests and production data integrity tests
- [ ] Add environment-specific configuration management
- [ ] **Testing:** Write configuration management tests for different environments
- [ ] Implement comprehensive error logging and monitoring
- [ ] **Testing:** Write monitoring and alerting tests
- [ ] Create user documentation and API reference
- [ ] **Testing:** Write documentation validation tests
- [ ] Submit actions.json to Dialect Blinks registry for whitelisting
- [ ] **Testing:** Write registry submission and validation tests
- [ ] Add analytics tracking for form completions and user interactions
- [ ] **Testing:** Write analytics tracking tests and data accuracy tests
- [ ] Implement rate limiting and abuse prevention measures
- [ ] **Testing:** Write security tests for rate limiting and abuse prevention
- [ ] **Testing:** Execute full end-to-end test suite covering all phases
- [ ] **Testing:** Perform security audit and penetration testing
- [ ] **Testing:** Conduct performance testing and load testing

## Required Resources
- **Database:** Supabase PostgreSQL
- **Caching:** Redis for session management
- **Blockchain:** Helius RPC for transaction simulation
- **Deployment:** Vercel for frontend and API routes
- **External Services:** Dialect Blinks SDK and registry

## Dependencies and Prerequisites
- Node.js and npm/yarn
- NestJS CLI
- Prisma CLI
- Supabase account and project
- Redis instance (local or cloud)
- Helius RPC account
- Vercel account for deployment
- Solana wallet for testing

## Success Criteria
- [ ] Creators can build and publish multi-step forms with conditional logic
- [ ] Users can interact with forms directly in social feeds (Twitter/X)
- [ ] Forms support both questions and blockchain transactions
- [ ] All transactions are simulated before signing for security
- [ ] Forms are whitelisted in Dialect Blinks registry
- [ ] Application deployed and accessible at blinkform.xyz

## Timeline Estimate
- **Phase 1:** 1 week - Core backend infrastructure
- **Phase 2:** 1 week - Visual builder interface
- **Phase 3:** 1 week - Advanced logic and transactions
- **Phase 4:** 1 week - Polish, security, and deployment

Total estimated timeline: 4 weeks
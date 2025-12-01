# BlinkForm Twitter/X Testing Plan

## Overview
This plan outlines the steps to create a minimal viable BlinkForm for testing on Twitter/X. The goal is to have a simple form (e.g., name input + choice question + end) that can be shared as a Blink URL and rendered interactively in tweets.

## Current Project State Analysis
- **Frontend**: Builder interface exists with canvas, nodes, mobile preview. Can save forms (but backend endpoint missing).
- **Backend**: Basic NestJS setup with Prisma, Redis. Actions GET endpoint exists but hardcoded. Missing: Forms CRUD, POST actions, proper schema parsing.
- **Database**: Supabase schema defined but not fully implemented.
- **Deployment**: Not deployed yet.

## Step-by-Step Plan

### 1. Design Minimal Viable Form
**Goal**: Simple 3-node form for testing.
- **Node 1**: Input Node - "What's your name?" (text input)
- **Node 2**: Choice Node - "Are you interested in Solana?" (Yes/No radio buttons)
- **Node 3**: End Node - "Thanks for your response!" (completion message)

**Schema Structure**:
```json
{
  "nodes": [
    {
      "id": "name_input",
      "type": "input",
      "data": {
        "questionText": "What's your name?",
        "inputType": "text",
        "required": true
      }
    },
    {
      "id": "interest_choice",
      "type": "choice",
      "data": {
        "questionText": "Are you interested in Solana?",
        "options": [
          {"id": "yes", "label": "Yes", "value": "yes"},
          {"id": "no", "label": "No", "value": "no"}
        ],
        "multiSelect": false,
        "required": true
      }
    },
    {
      "id": "end",
      "type": "end",
      "data": {
        "label": "Thank you!",
        "message": "Thanks for your response. We'll be in touch!"
      }
    }
  ],
  "edges": [
    {"id": "e1", "source": "name_input", "target": "interest_choice"},
    {"id": "e2", "source": "interest_choice", "target": "end"}
  ]
}
```

### 2. Implement Missing Backend Endpoints
**Priority**: High - Required for form saving and Blink functionality.

#### Forms Controller (`/api/forms`)
- **POST /api/forms**: Save new form
  - Accept: `{ metadata: {...}, schema: {...} }`
  - Return: `{ id: "form-uuid" }`
  - Store in database with generated UUID

- **GET /api/forms/:id**: Load form
  - Return form data for builder

- **PUT /api/forms/:id**: Update existing form

#### Enhanced Actions Controller
- **POST /api/actions/:formId**: Handle user inputs
  - Accept: `{ account: "user-pubkey" }` + query params for answers
  - Logic:
    1. Load form schema from DB
    2. Get/update session from Redis
    3. Parse current node from schema
    4. Validate input
    5. Determine next node
    6. Return ActionPostResponse or NextActionLink

#### Schema Parser Service
- Parse JSON schema into executable logic
- Handle node connections and branching
- Generate proper Action responses

### 3. Build and Save Test Form
**Tools**: Use existing frontend builder
- Navigate to `/builder`
- Add nodes via left sidebar
- Connect with edges
- Configure node data in right sidebar
- Save form (calls backend API)

**Expected Result**: Form saved with ID, accessible via `/api/actions/:id`

### 4. Deploy to Public URLs
**Backend Deployment**:
- Use Vercel/Railway for NestJS
- Set environment variables:
  - DATABASE_URL (Supabase)
  - REDIS_URL
  - CORS origins for frontend

**Frontend Deployment**:
- Vercel for Next.js
- Set NEXT_PUBLIC_API_URL to backend URL

**Domain**: Get a domain like `blinkform.xyz` or use Vercel subdomain

### 5. Generate and Test Blink URL
**URL Format**: `https://yourdomain.com/api/actions/:formId`

**Testing Steps**:
1. Hit GET endpoint - should return ActionGetResponse with title, description, icon
2. Simulate POST with account param - should advance through nodes
3. Use Dialect's `dial.to` debugger to preview
4. Verify OG metadata for Twitter unfurling

### 6. Twitter/X Integration
**Requirements**:
- Valid Solana Action response format
- OG image generation (implement dynamic images)
- Proper CORS headers

**Testing**:
- Share URL in tweet
- Verify it renders as interactive card
- Test form flow in tweet embed

### 7. Optional: Registry Submission
- Create `actions.json` manifest
- Submit to Dialect Blinks registry
- Enables broader Twitter compatibility

## Success Criteria
- [ ] Form loads in Twitter/X as interactive embed
- [ ] Users can fill out name and choice without leaving tweet
- [ ] Form completes and shows success message
- [ ] No wallet signatures required (for simple test)
- [ ] URL unfurls with proper preview

## Timeline
- **Day 1**: Implement backend endpoints, deploy
- **Day 2**: Build test form, test locally
- **Day 3**: Full deployment, Twitter testing

## Risks & Mitigations
- **Backend incomplete**: Focus on minimal endpoints first
- **Schema complexity**: Start with linear flow, no branching
- **Twitter rendering**: Test with Dialect debugger first
- **Deployment issues**: Use Vercel for simplicity

## Next Steps
1. Start implementing forms controller
2. Deploy backend skeleton
3. Build and save test form
4. Iterate on deployment and testing
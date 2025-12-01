

# **Part 1: Strategic Research Report**

*(Research Context \- See Part 2 for Technical Specification)*

## **1\. Executive Summary: The Architectural Imperative**

The Solana ecosystem is transitioning from infrastructure optimization to application-layer value capture. While the network has achieved global scale, the "last mile" of user interaction remains a bottleneck.1 The introduction of **Solana Actions** and **Blinks** (Blockchain Links) allows transactions to be embedded directly into social feeds, shifting the paradigm from "Destination-Based" to "Context-Based" interaction.2  
**BlinkForm** addresses the "Complexity Cliff" hindering creators from using these primitives.1 By providing a no-code visual interface for constructing stateful, multi-step logic flows (e.g., Surveys, KYC, Gated Payments), BlinkForm bridges the gap between protocol capabilities and user accessibility.  
---

# **Part 2: BlinkForm Spec-Driven Development (SDD) Manifest**

## **1\. Project Constitution**

Mission: Democratize the creation of stateful, context-aware blockchain interactions ("Blinks") through a visual, no-code interface.  
Core Principles:

1. **Schema-Driven:** The backend is a generic runtime engine; all logic is defined by the JSON Schema stored in the database.  
2. **Ephemeral State:** User sessions are short-lived and cached in Redis to maintain "state" over the stateless HTTP protocol.  
3. **Security by Design:** All transactions are simulated before generation; strict validation on all inputs.

## **2\. User Stories & Acceptance Criteria**

### **2.1 The Creator (Builder)**

* **Story:** As a DAO lead, I want to create a "Quiz-to-Mint" Blink so that I can onboard new members directly on Twitter.  
* **Acceptance Criteria:**  
  * Can drag-and-drop "Question Nodes" (Text, Choice) and "Transaction Nodes" (Mint NFT).  
  * Can connect nodes to define conditional logic (e.g., "If Answer \= 'A', go to Node 2").  
  * Can click "Publish" to generate a blinkform.xyz/f/{id} URL.  
  * The URL unfurls correctly on Dialect's dial.to debugger.

### **2.2 The User (Responder)**

* **Story:** As a user on Twitter, I want to take the quiz and mint the NFT without leaving my timeline.  
* **Acceptance Criteria:**  
  * Clicking the Blink displays the first question and options as buttons.  
  * Selecting an option advances the form immediately (Inline Action) without a wallet signature if no funds are moving.  
  * The final step prompts a wallet signature to mint the NFT.  
  * The entire flow preserves context (answers are remembered).

## **3\. Data Architecture (Schema Definition)**

### **3.1 PostgreSQL Schema (Supabase)**

This is the source of truth for Form definitions and permanent records.

SQL

\-- The "Blueprint" for a Blink  
CREATE TABLE forms (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  creator\_address VARCHAR(44) NOT NULL,  
  title TEXT NOT NULL,  
  description TEXT,  
  \-- The JSON Graph defining nodes/edges (See Section 3.3)  
  schema JSONB NOT NULL,   
  is\_active BOOLEAN DEFAULT true,  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- Completed submissions (for analytics/logic)  
CREATE TABLE submissions (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  form\_id UUID REFERENCES forms(id),  
  user\_account VARCHAR(44) NOT NULL,  
  answers JSONB NOT NULL, \-- Key-Value pair of { "node\_id": "answer" }  
  transaction\_signature VARCHAR(88), \-- The final on-chain proof  
  completed\_at TIMESTAMPTZ DEFAULT NOW()  
);

### **3.2 Redis Schema (Ephemeral State)**

Used for maintaining the session during the multi-step flow.

* **Key:** session:{form\_id}:{user\_account}  
* **Value (JSON):**  
  JSON  
  {  
    "current\_node\_id": "step\_2\_email",  
    "history": {  
      "step\_1\_name": "Alice",  
      "step\_2\_email": "alice@example.com"  
    },  
    "expires\_at": 1715420000  
  }

* **TTL:** 15 Minutes.

### **3.3 The Logic Graph (JSON Schema)**

This JSON object, stored in Postgres, tells the Runtime Engine how to behave.

JSON

{  
  "nodes":  
      }  
    },  
    {  
      "id": "node\_mint\_yes",  
      "type": "transaction",  
      "data": {  
        "program": "SPL\_MINT",  
        "mint\_address": "TokenA...",  
        "amount": 1  
      }  
    }  
  \]  
}

## **4\. API Specification (The Runtime Engine)**

### **4.1 GET action-get**

* **Endpoint:** /api/actions/:formId  
* **Purpose:** Initializes the Blink. Checks if a session exists; if not, starts at the start\_node.  
* **Logic:**  
  1. Fetch forms row by :formId.  
  2. Identify start\_node.  
  3. Construct standard ActionGetResponse based on the node type.  
* **Response (Standard Action Spec):**  
  JSON  
  {  
    "icon": "https://blinkform.xyz/og/start.png",  
    "title": "DAO Governance Quiz",  
    "description": "Step 1 of 3",  
    "label": "Start",  
    "links": {  
      "actions":  
    }  
  }

### **4.2 POST action-post**

* **Endpoint:** /api/actions/:formId  
* **Purpose:** Handles user input, updates state, and returns the next step or transaction.  
* **Body:** { "account": "User\_Pubkey" }  
* **Query Params:** ?next\_node=node\_id\&answer=value  
* **Logic:**  
  1. **Hydrate:** Fetch session from Redis using account \+ formId.  
  2. **Validate:** Check if input matches the expected type for the current node.  
  3. **Update State:** Save answer to Redis history.  
  4. **Determine Next:** Look up next\_node from schema.  
  5. **Branch:**  
     * If next\_node is **Logic/Question**: Return NextActionLink (Inline) to render the next question immediately.3  
     * If next\_node is **Transaction**: Use TransactionFactory to build the Solana transaction (e.g., Mint, Swap) and return standard ActionPostResponse.

## **5\. Component Specifications (Frontend)**

### **5.1 The Graph Builder (React Flow)**

* **Library:** react-flow-renderer  
* **Custom Node Types:**  
  * QuestionNode: Contains input fields for Question Text and an array of Options. Each Option adds a "Handle" to the node for connecting edges.  
  * TransactionNode: A form to select transaction type (Transfer/Mint) and parameters (Amount, Mint Address).  
* **State Management:** Zustand store to manage the graph state locally before saving to Postgres.

### **5.2 The Blink Simulator**

* **Purpose:** WYSIWYG preview for the creator.  
* **Implementation:** An iframe rendering the @dialectlabs/blinks UI component. It points to a local API route that mocks the real runtime engine, allowing instant feedback on logic changes.4

## **6\. Implementation Roadmap**

### **Phase 1: Core Engine (Week 1\)**

* \[ \] **Backend:** Setup NestJS with Supabase and Redis.  
* \[ \] **API:** Implement generic GET /api/actions/:id handler.  
* \[ \] **Logic:** Implement basic "Linear Flow" (Step 1 \-\> Step 2 \-\> End).  
* \[ \] **Test:** Verify with curl that state persists across requests.

### **Phase 2: The Builder (Week 2\)**

* \[ \] **Frontend:** Setup Next.js with React Flow.  
* \[ \] **UI:** Create "Question" and "End" nodes.  
* \[ \] **Wiring:** Connect Frontend Save button to Backend Schema persistence.  
* \[ \] **Simulator:** Embed Dialect SDK to preview the active graph.

### **Phase 3: Transaction & Logic (Week 3\)**

* \[ \] **Backend:** Implement TransactionFactory (Solana Web3.js).  
* \[ \] **Feature:** Support "Conditional Edges" (Branching logic).  
* \[ \] **Integration:** Add Helius RPC for transaction simulation before returning to user.1

### **Phase 4: Polish & Registry (Week 4\)**

* \[ \] **Security:** Implement signature verification.  
* \[ \] **UX:** Add "Loading" states and custom OG Image generation for each step.  
* \[ \] **Deploy:** Vercel (Frontend/API) \+ Supabase (DB).  
* \[ \] **Registry:** Submit actions.json to Dialect for whitelisting.5

---

## **7\. Technical constraints & Edge Cases**

* **Constraint:** HTTP is stateless. **Solution:** session\_id must be passed in query params or derived deterministically from User\_Pubkey \+ Form\_ID.  
* **Constraint:** Transaction size limits. **Solution:** If a form is too long to store results on-chain in one go, use the Redis state to aggregate and only hash/commit the final result to Arweave or a Memo instruction.  
* **Edge Case:** User switches wallets mid-stream. **Solution:** The session is keyed to User\_Pubkey. If the signer changes, the API must reject the request (403 Forbidden).

#### **Referências citadas**

1. Análise Profunda Solana Actions BlinkForm.docx  
2. What are Solana Actions and Blockchain Links (Blinks)? | Quicknode Guides, acessado em novembro 29, 2025, [https://www.quicknode.com/guides/solana-development/transactions/actions-and-blinks](https://www.quicknode.com/guides/solana-development/transactions/actions-and-blinks)  
3. solana-actions/packages/actions-spec/index.d.ts at main \- GitHub, acessado em novembro 29, 2025, [https://github.com/solana-developers/solana-actions/blob/main/packages/actions-spec/index.d.ts](https://github.com/solana-developers/solana-actions/blob/main/packages/actions-spec/index.d.ts)  
4. Introducing the Blinks Client \- Dialect Labs \- Medium, acessado em novembro 29, 2025, [https://medium.com/dialect-labs/introducing-the-blinks-client-sdk-8bf0e3474349](https://medium.com/dialect-labs/introducing-the-blinks-client-sdk-8bf0e3474349)  
5. Introducing the Blinks Public Registry | by Dialect Labs \- Medium, acessado em novembro 29, 2025, [https://medium.com/dialect-labs/introducing-the-blinks-public-registry-fa103bca2852](https://medium.com/dialect-labs/introducing-the-blinks-public-registry-fa103bca2852)
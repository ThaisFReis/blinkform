# BlinkForm Nodes Comprehensive Reference

## Overview

This document provides comprehensive documentation for all implemented nodes in the BlinkForm visual form builder system. Each node represents a functional component that can be connected to create complex, interactive forms with blockchain integration capabilities.

The system supports four main node categories:
- **Question Nodes**: Collect user input through various form controls
- **Transaction Nodes**: Execute on-chain Solana operations
- **Logic Nodes**: Provide conditional branching, validation, and calculations
- **End Nodes**: Mark form completion and trigger success actions

## Node Organization

### Core Components (Question Nodes)
These nodes collect user data through various input methods and form the foundation of any form.

### On-Chain Actions (Transaction Nodes)
These nodes execute blockchain operations on the Solana network, enabling direct integration with smart contracts and token operations.

### Logic & Utilities (Logic Nodes)
These nodes add intelligence to forms through conditional logic, cross-field validation, and mathematical operations.

### Terminal Nodes (End Nodes)
These nodes mark the completion of a form workflow and can trigger various success actions.

## Node Reference

---

## 1. Question Nodes

### 1.1 Input Node

**Purpose**: Collects user input through various text-based form controls including text, numbers, emails, phone numbers, CPF (Brazilian tax ID), and currency values.

**Function**: Provides configurable input fields with built-in validation, formatting, and type-specific behaviors.

#### Inputs and Dependencies
- **Question Text**: Required string defining the field label
- **Input Type**: One of: `text`, `number`, `email`, `phone`, `cpf`, `currency`, `custom`
- **Placeholder**: Optional string for input hint text
- **Validation Rules**:
  - `required`: Boolean - field must be filled
  - `minLength`/`maxLength`: Number - text length constraints
  - `min`/`max`: Number - numeric value constraints
  - `pattern`: String - regex validation pattern

#### Outputs
- **Data Type**: String (all input types stored as strings)
- **Format Variations**:
  - Text: Raw string input
  - Number: Numeric string (validated for digits)
  - Email: RFC-compliant email format
  - Phone: Formatted phone number (Brazilian format: (11) 99999-9999)
  - CPF: Brazilian tax ID format (123.456.789-00)
  - Currency: Formatted currency (R$ 1.234,56)
  - Custom: User-defined format

#### Interconnections
- **Input Handle**: Single target handle at top (receives flow from previous nodes)
- **Output Handle**: Single source handle at bottom (sends data to next nodes)
- **Data Flow**: Passes collected value to subsequent nodes for processing, validation, or transactions

#### Usage Scenarios
- **Basic Text Collection**: Simple name or description fields
- **Numeric Input**: Age, quantity, or measurement fields
- **Contact Information**: Email addresses and phone numbers
- **Brazilian Forms**: CPF validation for tax-related forms
- **Financial Forms**: Currency inputs for payment amounts

#### Edge Cases and Error States
- **Required Field Empty**: Form cannot proceed, validation error displayed
- **Invalid Format**: Email/phone/CPF validation fails, user prompted to correct
- **Length Violations**: Text exceeds min/max length constraints
- **Numeric Bounds**: Values outside min/max range rejected
- **Pattern Mismatch**: Custom regex patterns not matched

**Example Configuration**:
```typescript
{
  questionText: "Enter your email address",
  inputType: "email",
  placeholder: "user@example.com",
  validation: {
    required: true,
    pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"
  }
}
```

---

### 1.2 Choice Node

**Purpose**: Presents users with multiple options for selection, supporting both single-choice (radio buttons) and multi-choice (checkboxes) scenarios.

**Function**: Dynamically manages option lists with add/remove/reorder capabilities and configurable selection modes.

#### Inputs and Dependencies
- **Question Text**: Required string defining the choice question
- **Options Array**: Array of objects with `id`, `label`, `value` properties
- **Multi-Select**: Boolean - true for checkboxes, false for radio buttons
- **Validation Rules**: `required` boolean for mandatory selection

#### Outputs
- **Data Type**: String or String[] (single value or array based on multi-select)
- **Format Variations**:
  - Single Select: Single string value of selected option
  - Multi Select: Array of selected option values
- **Conditional Variations**: Output format changes based on multiSelect setting

#### Interconnections
- **Input Handle**: Single target handle at top
- **Output Handle**: Single source handle at bottom
- **Data Flow**: Selected values flow to conditional nodes for branching logic
- **Relationships**: Commonly connected to ConditionalNode for decision trees

#### Usage Scenarios
- **Survey Questions**: Rating scales, preference selections
- **Form Branching**: User type selection (customer vs business)
- **Feature Selection**: Multiple service options
- **Consent Forms**: Terms acceptance with multiple clauses

#### Edge Cases and Error States
- **No Options Configured**: Node displays "No options configured" message
- **Required Selection Missing**: Form blocked until selection made
- **Empty Options Array**: Graceful degradation with placeholder text
- **Single Option in Multi-Select**: Technically valid but UX consideration

**Example Configuration**:
```typescript
{
  questionText: "What services are you interested in?",
  multiSelect: true,
  options: [
    { id: "1", label: "Web Development", value: "web_dev" },
    { id: "2", label: "Mobile Apps", value: "mobile" },
    { id: "3", label: "Blockchain Integration", value: "blockchain" }
  ],
  validation: { required: true }
}
```

---

### 1.3 Date Node

**Purpose**: Collects date input from users through a date picker interface with configurable validation ranges.

**Function**: Provides calendar-based date selection with min/max date constraints and formatted display.

#### Inputs and Dependencies
- **Question Text**: Required string defining the date question
- **Validation Rules**:
  - `required`: Boolean
  - `min`: String - minimum date (ISO format)
  - `max`: String - maximum date (ISO format)

#### Outputs
- **Data Type**: String (ISO date format: YYYY-MM-DD)
- **Format**: Standardized ISO 8601 date string
- **Validation**: Automatic date range checking

#### Interconnections
- **Input Handle**: Single target handle at top
- **Output Handle**: Single source handle at bottom
- **Data Flow**: Date values for age calculations, scheduling, or conditional logic

#### Usage Scenarios
- **Birth Dates**: Age verification and calculations
- **Appointment Scheduling**: Available date ranges
- **Event Registration**: Event date selection
- **Contract Dates**: Effective dates with validation

#### Edge Cases and Error States
- **Invalid Date Range**: Min date after max date
- **Past/Future Restrictions**: Dates outside allowed ranges
- **Required Date Missing**: Form progression blocked
- **Browser Date Picker Issues**: Fallback handling for unsupported browsers

**Example Configuration**:
```typescript
{
  questionText: "Select your birth date",
  validation: {
    required: true,
    min: "1900-01-01",
    max: new Date().toISOString().split('T')[0] // Today
  }
}
```

---

## 2. Transaction Nodes

### 2.1 Transaction Node

**Purpose**: Executes generic on-chain Solana operations including token minting, transfers, and system operations.

**Function**: Provides a configurable interface for various Solana transaction types with dynamic parameter fields.

#### Inputs and Dependencies
- **Transaction Type**: One of `SPL_MINT`, `SPL_TRANSFER`, `SYSTEM_TRANSFER`
- **Program ID**: Solana program identifier (base58 string)
- **Parameters Object**: Type-specific parameters:
  - SPL_MINT: `amount`, `decimals`, `mintAddress`
  - SPL_TRANSFER: `amount`, `recipientAddress`, `decimals`
  - SYSTEM_TRANSFER: `amount` (SOL in lamports)

#### Outputs
- **Data Type**: TransactionResult object
- **Format**: `{ signature: string, success: boolean, error?: string }`
- **Blockchain Effects**: On-chain state changes (token balances, NFT ownership)

#### Interconnections
- **Input Handle**: Single target handle (receives trigger from form flow)
- **Output Handle**: Single source handle (continues to next node)
- **Data Dependencies**: Often receives amounts/addresses from previous question nodes
- **Relationships**: Can be chained with other transaction nodes for complex operations

#### Usage Scenarios
- **Token Distribution**: Airdropping tokens to form completers
- **Payment Processing**: Collecting SOL payments for services
- **NFT Rewards**: Minting achievement NFTs
- **Multi-step Transactions**: Complex DeFi operations

#### Edge Cases and Error States
- **Insufficient Balance**: Transaction fails with balance error
- **Invalid Addresses**: Malformed Solana addresses rejected
- **Network Congestion**: Timeout or high fee scenarios
- **Program Errors**: Smart contract execution failures
- **Decimal Precision**: Incorrect token decimal handling

**Example Configuration**:
```typescript
{
  transactionType: "SPL_TRANSFER",
  program: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", // SPL Token Program
  parameters: {
    amount: 1000000, // 1 token with 6 decimals
    recipientAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAs",
    decimals: 6
  }
}
```

---

### 2.2 Mint NFT Node

**Purpose**: Simplified interface for creating and minting NFTs on Solana with metadata configuration.

**Function**: Streamlines NFT creation with collection management and metadata handling.

#### Inputs and Dependencies
- **Collection Address**: Optional Solana address for NFT collection
- **Mint Parameters**:
  - `name`: NFT name
  - `symbol`: Token symbol
  - `uri`: Metadata JSON URI
  - `amount`: Number of NFTs to mint (usually 1)
- **Use Form Collection**: Boolean to inherit collection settings

#### Outputs
- **Data Type**: MintResult object
- **Format**: `{ mintAddress: string, signature: string, metadata: object }`
- **Blockchain Effects**: New NFT created in user's wallet

#### Interconnections
- **Input Handle**: Receives trigger from form completion
- **Output Handle**: Continues workflow after minting
- **Data Flow**: Can use form data for dynamic metadata

#### Usage Scenarios
- **Achievement NFTs**: Completion certificates
- **Membership Tokens**: Access control NFTs
- **Event Tickets**: Verifiable event admission
- **Collectibles**: Limited edition digital items

#### Edge Cases and Error States
- **Collection Not Found**: Invalid collection address
- **Metadata Upload Failure**: URI inaccessible or malformed
- **Minting Limits**: Collection size restrictions
- **Duplicate Names**: Symbol conflicts in collection

**Example Configuration**:
```typescript
{
  transactionType: "SPL_MINT",
  parameters: {
    name: "Completion Certificate",
    symbol: "CERT",
    uri: "https://arweave.net/metadata.json",
    amount: 1,
    collectionAddress: "COLL3CT10NADDR3SS"
  }
}
```

---

### 2.3 Call Contract Node

**Purpose**: Executes custom Solana program instructions with full control over accounts and instruction data.

**Function**: Advanced interface for interacting with any Solana program through custom instruction building.

#### Inputs and Dependencies
- **Program ID**: Target Solana program address
- **Instruction Data**: Custom instruction parameters
- **Accounts Array**: Account metas with pubkey, isSigner, isWritable flags
- **Advanced Mode**: Boolean for extended configuration options

#### Outputs
- **Data Type**: InstructionResult object
- **Format**: `{ signature: string, logs: string[], success: boolean }`
- **Blockchain Effects**: Program-specific state changes

#### Interconnections
- **Input Handle**: Receives execution trigger
- **Output Handle**: Continues after instruction execution
- **Complex Dependencies**: May require multiple input data sources

#### Usage Scenarios
- **Custom DeFi Operations**: Complex financial transactions
- **DAO Interactions**: Governance voting and proposals
- **Gaming Logic**: Game state updates and rewards
- **Custom Business Logic**: Specialized program interactions

#### Edge Cases and Error States
- **Invalid Program ID**: Non-existent or incorrect program address
- **Account Permission Errors**: Missing signer or writable flags
- **Instruction Data Corruption**: Malformed instruction parameters
- **Program Runtime Errors**: Smart contract logic failures

**Example Configuration**:
```typescript
{
  transactionType: "CUSTOM_CALL",
  program: "PROGRAM1DENTIFIER",
  parameters: {
    instructionData: Buffer.from([1, 2, 3, 4]), // Custom instruction
    accounts: [
      {
        pubkey: "ACCOUNT1",
        isSigner: true,
        isWritable: true
      },
      {
        pubkey: "ACCOUNT2",
        isSigner: false,
        isWritable: false
      }
    ]
  }
}
```

---

## 3. Logic Nodes

### 3.1 Conditional Node

**Purpose**: Implements conditional branching logic based on user responses, enabling dynamic form flows.

**Function**: Evaluates conditions against previous answers and routes execution through different paths with visual branch handles.

#### Inputs and Dependencies
- **Mode**: `switch` or `multi-condition` branching pattern
- **Switch Mode**:
  - `switchQuestionId`: Question to evaluate
  - `branches`: Array of branch configurations with conditions
- **Multi-Condition Mode**: Legacy support for complex condition combinations

#### Outputs
- **Data Type**: BranchResult object
- **Format**: `{ selectedBranch: string, conditionMet: boolean }`
- **Multiple Paths**: Dynamic output handles (2-4 branches) with color coding
- **Conditional Variations**: Branch count and colors vary by configuration

#### Interconnections
- **Input Handle**: Single target handle at top
- **Output Handles**: Multiple colored source handles (right, bottom, left, top)
- **Complex Relationships**: Creates decision trees with Question → Conditional → different paths
- **Data Flow**: Routes form execution based on user responses

#### Usage Scenarios
- **User Segmentation**: Different flows for customers vs businesses
- **Eligibility Checks**: Age or income-based branching
- **Feature Gates**: Premium vs free user paths
- **Survey Logic**: Skip irrelevant questions

#### Edge Cases and Error States
- **No Branches Configured**: Node shows "0 branches" with no outputs
- **Circular Dependencies**: Conditions referencing future questions
- **Invalid Question IDs**: Referenced questions don't exist
- **Overlapping Conditions**: Multiple branches could match (first match wins)

**Example Configuration**:
```typescript
{
  logicType: "conditional",
  mode: "switch",
  switchQuestionId: "user_type",
  branches: [
    {
      id: "customer",
      label: "Customer",
      color: "#22c55e",
      matchValues: ["customer"]
    },
    {
      id: "business",
      label: "Business",
      color: "#3b82f6",
      matchValues: ["business"]
    }
  ]
}
```

---

### 3.2 Validation Node

**Purpose**: Performs cross-field validation with complex business rules, blocking progression on validation failures.

**Function**: Evaluates multiple validation rules across form data with configurable error handling.

#### Inputs and Dependencies
- **Validation Rules Array**: Array of validation rule objects
- **Block on Failure**: Boolean (default: true) - whether to stop form flow
- **Rule Types**:
  - `compare`: Field comparison operations
  - `sum`: Sum validation across fields
  - `range`: Value range checking
  - `custom`: Custom validation logic

#### Outputs
- **Data Type**: ValidationResult object
- **Format**: `{ isValid: boolean, errors: string[], ruleResults: object[] }`
- **Dual Paths**: Separate "valid" (green) and "invalid" (red) output handles
- **Conditional Variations**: Flow continues on valid path, may block or continue on invalid

#### Interconnections
- **Input Handle**: Single target handle at top
- **Output Handles**: Two source handles - "VALID" (right) and "INVALID" (bottom)
- **Blocking Behavior**: Can halt form progression on validation failure
- **Relationships**: Often placed before transaction nodes to ensure data integrity

#### Usage Scenarios
- **Business Rule Validation**: Complex eligibility requirements
- **Data Consistency**: Cross-field dependency checks
- **Financial Validation**: Sum checks and range validations
- **Custom Business Logic**: Domain-specific validation rules

#### Edge Cases and Error States
- **Missing Referenced Fields**: Validation rules reference non-existent questions
- **Circular Validation**: Rules depending on each other's results
- **Type Mismatches**: Comparing incompatible data types
- **Custom Logic Errors**: JavaScript execution failures in custom rules

**Example Configuration**:
```typescript
{
  logicType: "validation",
  validationRules: [
    {
      id: "age_check",
      type: "range",
      description: "Age must be between 18-65",
      errorMessage: "Age requirement not met",
      rangeField: "age",
      minValue: 18,
      maxValue: 65
    },
    {
      id: "income_sum",
      type: "sum",
      description: "Total income must equal declared amount",
      errorMessage: "Income figures don't match",
      sumFields: ["salary", "bonus", "investments"],
      expectedSum: "total_income"
    }
  ],
  blockOnFailure: true
}
```

---

### 3.3 Calculation Node

**Purpose**: Performs mathematical operations on numeric form data, storing results for use in conditions or transactions.

**Function**: Executes configurable calculation operations with support for basic arithmetic and variable storage.

#### Inputs and Dependencies
- **Operations Array**: Array of calculation operation objects
- **Operation Types**: `add`, `subtract`, `multiply`, `divide`, `modulo`, `power`
- **Operands**: Mix of field references (question IDs) and literal numbers
- **Result Variables**: Named storage for calculation results

#### Outputs
- **Data Type**: CalculationResult object
- **Format**: `{ [variableName]: number, operations: object[] }`
- **Stored Variables**: Results available to subsequent nodes
- **Single Path**: Continues to next node after calculations complete

#### Interconnections
- **Input Handle**: Single target handle at top
- **Output Handle**: Single source handle at bottom
- **Data Dependencies**: Requires numeric input from question nodes
- **Variable Propagation**: Results stored in form context for other nodes

#### Usage Scenarios
- **Pricing Calculations**: Dynamic cost computation
- **Age Calculations**: Current age from birth date
- **Financial Computations**: Interest, taxes, totals
- **Scoring Systems**: Weighted calculations for decisions

#### Edge Cases and Error States
- **Division by Zero**: Mathematical errors in division operations
- **Non-numeric Inputs**: Referenced fields contain non-numeric data
- **Missing Operands**: Required fields not provided
- **Overflow/Underflow**: Extremely large or small numbers

**Example Configuration**:
```typescript
{
  logicType: "calculation",
  operations: [
    {
      id: "total_cost",
      operator: "multiply",
      operands: ["quantity", 1.1], // Quantity * 1.1 (10% markup)
      resultVariable: "final_price",
      description: "Calculate final price with markup"
    },
    {
      id: "age_calc",
      operator: "subtract",
      operands: [new Date().getFullYear(), "birth_year"],
      resultVariable: "current_age",
      description: "Calculate current age"
    }
  ]
}
```

---

## 4. End Nodes

### 4.1 End Node

**Purpose**: Marks the successful completion of a form workflow and triggers configurable success actions.

**Function**: Provides a terminal node that saves form data and executes post-completion actions like emails, webhooks, or redirects.

#### Inputs and Dependencies
- **Label**: Display text for the completion node
- **Message**: Optional success message
- **Success Actions Array**: Configurable actions to execute:
  - `email`: Send completion emails
  - `webhook`: POST to external URLs
  - `redirect`: Redirect to success page
  - `custom`: Execute custom logic

#### Outputs
- **Data Type**: CompletionResult object
- **Format**: `{ formId: string, submissionId: string, actionsExecuted: object[] }`
- **Terminal Behavior**: No output handles - ends the flow
- **Database Effects**: Form submission saved to backend

#### Interconnections
- **Input Handle**: Single target handle (receives completion trigger)
- **No Output Handles**: Terminal node with no outgoing connections
- **Final Step**: Last node in any form workflow
- **Action Dependencies**: May reference form data for dynamic content

#### Usage Scenarios
- **Form Completion**: Standard form submission confirmation
- **Order Processing**: Trigger fulfillment workflows
- **Registration Flows**: Send welcome emails and setup accounts
- **Survey Completion**: Provide results and next steps

#### Edge Cases and Error States
- **Action Failures**: Individual success actions may fail while others succeed
- **Network Timeouts**: Webhook or email delivery failures
- **Invalid Redirects**: Malformed redirect URLs
- **Database Errors**: Submission save failures

**Example Configuration**:
```typescript
{
  label: "Form Complete!",
  message: "Thank you for your submission. We'll be in touch soon.",
  successActions: [
    {
      id: "confirmation_email",
      type: "email",
      enabled: true,
      emailRecipient: "user_email", // References form field
      emailSubject: "Form Submission Confirmation",
      emailTemplate: "Thank you for submitting our form..."
    },
    {
      id: "webhook_notification",
      type: "webhook",
      enabled: true,
      webhookUrl: "https://api.company.com/webhooks/form-submission",
      webhookMethod: "POST",
      webhookHeaders: {
        "Authorization": "Bearer token123",
        "Content-Type": "application/json"
      }
    },
    {
      id: "redirect_success",
      type: "redirect",
      enabled: true,
      redirectUrl: "https://company.com/thank-you"
    }
  ]
}
```

---

## Node Summary Table

| Category | Node Type | Purpose | Input Handles | Output Handles | Key Features |
|----------|-----------|---------|---------------|----------------|--------------|
| **Question** | Input Node | Text/number input collection | 1 (top) | 1 (bottom) | Multiple input types, validation |
| **Question** | Choice Node | Multiple choice selection | 1 (top) | 1 (bottom) | Single/multi-select, dynamic options |
| **Question** | Date Node | Date input with validation | 1 (top) | 1 (bottom) | Date picker, range validation |
| **Transaction** | Transaction Node | Generic Solana operations | 1 (top) | 1 (bottom) | SPL tokens, SOL transfers |
| **Transaction** | Mint NFT Node | NFT creation and minting | 1 (top) | 1 (bottom) | Metadata, collection support |
| **Transaction** | Call Contract Node | Custom program calls | 1 (top) | 1 (bottom) | Full instruction control |
| **Logic** | Conditional Node | Branching logic | 1 (top) | 2-4 (sides) | Multi-branch routing |
| **Logic** | Validation Node | Cross-field validation | 1 (top) | 2 (valid/invalid) | Blocking validation |
| **Logic** | Calculation Node | Mathematical operations | 1 (top) | 1 (bottom) | Variable storage |
| **End** | End Node | Form completion | 1 (top) | 0 (terminal) | Success actions |

## Data Flow Patterns

### Linear Flow
```
Input Node → Choice Node → Transaction Node → End Node
```

### Conditional Flow
```
Question Node → Conditional Node → Path A
                        ↓
                     Path B
```

### Validation Flow
```
Input Nodes → Validation Node → Valid: Continue
                      ↓
                   Invalid: Error Handling
```

### Complex Flow with Calculations
```
Input Node → Calculation Node → Conditional Node → Transaction Node → End Node
```

## Error Handling

All nodes implement comprehensive error handling:

- **Validation Errors**: Field-level validation with user feedback
- **Network Errors**: Timeout and retry logic for blockchain operations
- **Data Errors**: Type checking and sanitization
- **Configuration Errors**: Node setup validation
- **Runtime Errors**: Graceful degradation with error logging

## Performance Considerations

- **Lazy Loading**: Nodes load components on demand
- **Memoization**: Expensive calculations cached
- **Debounced Validation**: Input validation throttled
- **Optimistic Updates**: UI updates before blockchain confirmation
- **Background Processing**: Non-blocking operations for better UX

---

*This documentation reflects the implemented node system as of the current codebase. Node behaviors and configurations may evolve with future updates.*
# BlinkForm Sidebar Nodes Reference Document

## Overview
This document serves as a comprehensive reference for all node types that need to be created for BlinkForm's visual form builder left sidebar. The nodes are organized into **4 functional sections**.

## Type System Updates Required

### Current Node Types
- `question`
- `transaction`
- `end`

### New Node Type to Add
- `logic` - For conditional branching, validation, and calculation nodes

**Updated Type Definition**:
```typescript
type NodeType = 'question' | 'transaction' | 'logic' | 'end';
```

---

## Node Organization by Functional Sections

The nodes are organized into **4 functional sections** based on BlinkForm's application architecture:

---

## Section 1: Input/Question Nodes
**Purpose**: Collect user data through various input methods

### 1.1 Text Input Node
- **File**: `frontend/src/components/nodes/TextInputNode.tsx`
- **Type**: `question` (questionType: `'text'`)
- **Functionality**:
  - Single-line or multi-line text input
  - Configurable placeholder text
  - Validation rules (required, minLength, maxLength, pattern)
- **Visual Representation**: Text field icon (T)
- **Configuration Panel**:
  - Question text input
  - Placeholder text
  - Validation rules toggles
  - Min/max length settings

### 1.2 Choice/Select Node
- **File**: `frontend/src/components/nodes/ChoiceNode.tsx`
- **Type**: `question` (questionType: `'choice'`)
- **Functionality**:
  - Multiple choice selection (radio buttons or dropdown)
  - Dynamic options management (add/remove/reorder)
  - Single source handle (conditional logic handled by separate ConditionalNode)
- **Visual Representation**: Radio button icon (C)
- **Configuration Panel**:
  - Question text input
  - Options list editor (add/remove options)
  - Option reordering
  - Single vs multiple selection toggle
- **Connection Behavior**: Standard single source handle at bottom. For conditional branching based on selected option, users should connect to a ConditionalNode that evaluates the answer

### 1.3 Number Input Node
- **File**: `frontend/src/components/nodes/NumberNode.tsx`
- **Type**: `question` (questionType: `'number'`)
- **Functionality**:
  - Numeric input field
  - Min/max value validation
  - Step increment configuration
- **Visual Representation**: Hash/number icon (N)
- **Configuration Panel**:
  - Question text input
  - Min/max value settings
  - Step increment value
  - Required toggle

### 1.4 Date Input Node
- **File**: `frontend/src/components/nodes/DateNode.tsx`
- **Type**: `question` (questionType: `'date'`)
- **Functionality**:
  - Date picker input
  - Date range validation (min/max dates)
  - Format configuration
- **Visual Representation**: Calendar icon (D)
- **Configuration Panel**:
  - Question text input
  - Min/max date restrictions
  - Date format selection
  - Required toggle

### 1.5 Checkbox Node
- **File**: `frontend/src/components/nodes/CheckboxNode.tsx`
- **Type**: `question` (questionType: `'choice'` with multi-select)
- **Functionality**:
  - Multiple selection checkboxes
  - Dynamic options management
  - Validation for min/max selections
- **Visual Representation**: Checkbox icon (B)
- **Configuration Panel**:
  - Question text input
  - Options list editor
  - Min/max selections allowed
  - Required toggle

---

## Section 2: Blockchain Transaction Nodes
**Purpose**: Execute on-chain Solana operations

### 2.1 Generic Transaction Node
- **File**: `frontend/src/components/nodes/TransactionNode.tsx`
- **Type**: `transaction` (transactionType: `'SPL_MINT' | 'SPL_TRANSFER' | 'SYSTEM_TRANSFER'`)
- **Functionality**:
  - Dropdown to select transaction type
  - Dynamic parameter fields based on transaction type
  - Transaction simulation preview
- **Visual Representation**: Transaction icon (Tx)
- **Configuration Panel**:
  - Transaction type selector
  - Dynamic parameter inputs based on type
  - Amount/address/decimals fields
  - Description/label input

### 2.2 Mint NFT Node
- **File**: `frontend/src/components/nodes/MintNFTNode.tsx`
- **Type**: `transaction` (transactionType: `'SPL_MINT'`)
- **Functionality**:
  - Simplified UI for NFT minting
  - Collection address input
  - Metadata configuration
  - Uses collection settings from form metadata
- **Visual Representation**: NFT/image icon (M)
- **Configuration Panel**:
  - Collection address input
  - Mint amount (usually 1)
  - Use form collection settings checkbox
  - Metadata fields (name, symbol, URI)

### 2.3 Transfer SOL Node
- **File**: `frontend/src/components/nodes/TransferSOLNode.tsx`
- **Type**: `transaction` (transactionType: `'SYSTEM_TRANSFER'`)
- **Functionality**:
  - Simplified UI for SOL transfers
  - Recipient address input
  - Amount in SOL (with lamports conversion)
- **Visual Representation**: Send/arrow icon (S)
- **Configuration Panel**:
  - Recipient address input
  - Amount in SOL
  - Optional memo field
  - Dynamic amount based on previous answers toggle

### 2.4 Call Contract Node
- **File**: `frontend/src/components/nodes/CallContractNode.tsx`
- **Type**: `transaction` (custom transactionType or extends base)
- **Functionality**:
  - Custom program address input
  - Instruction data configuration
  - Account metas configuration
- **Visual Representation**: Code/contract icon (Cc)
- **Configuration Panel**:
  - Program ID input
  - Instruction data builder
  - Accounts list (pubkey, isSigner, isWritable)
  - Advanced mode toggle

---

## Section 3: Logic & Control Flow Nodes
**Purpose**: Add conditional branching and validation logic

### 3.1 If/Then (Conditional) Node
- **File**: `frontend/src/components/nodes/ConditionalNode.tsx`
- **Type**: `logic` (NEW NODE TYPE)
- **Functionality**:
  - Evaluate conditions based on previous answers
  - Multiple condition operators (equals, contains, greater_than, less_than, not_equals)
  - True/False output handles for branching
- **Visual Representation**: Diamond/branch icon (I)
- **Configuration Panel**:
  - Select question to evaluate
  - Condition operator dropdown
  - Comparison value input
  - Show current evaluation state
- **Connection Behavior**: Two source handles (True branch, False branch)

### 3.2 Validation Node
- **File**: `frontend/src/components/nodes/ValidationNode.tsx`
- **Type**: `logic` (NEW NODE TYPE)
- **Functionality**:
  - Cross-field validation
  - Complex validation rules
  - Block progression if validation fails
- **Visual Representation**: Shield/checkmark icon (V)
- **Configuration Panel**:
  - Select fields to validate
  - Validation rule configuration
  - Error message input
  - Validation logic builder

### 3.3 Calculation Node
- **File**: `frontend/src/components/nodes/CalculationNode.tsx`
- **Type**: `logic` (NEW NODE TYPE)
- **Functionality**:
  - Perform calculations on previous numeric answers
  - Store result for use in transactions or conditions
  - Support basic operations (+, -, *, /, %)
- **Visual Representation**: Calculator icon (A)
- **Configuration Panel**:
  - Formula builder
  - Select numeric fields
  - Operation selector
  - Result variable name
  - Preview calculation

---

## Section 4: Terminal/Completion Nodes
**Purpose**: Mark form endpoints

### 4.1 End Form Node
- **File**: `frontend/src/components/nodes/EndNode.tsx`
- **Type**: `end`
- **Functionality**:
  - Mark successful form completion
  - Display success message
  - Cannot have outgoing connections
  - Save submission to database
- **Visual Representation**: Flag/finish icon (Ef)
- **Configuration Panel**:
  - Success message input
  - Show submission summary toggle
  - Redirect URL (optional)
  - Custom completion action

---

## Conditional Branching Approach

**Decision**: Use a separate ConditionalNode for all conditional logic rather than multiple output handles per option.

**Rationale**:
- **Cleaner Visual Graph**: Each node has standard single source handle
- **Explicit Logic**: Conditional logic is visible as a dedicated node
- **Easier Debugging**: Users can see and modify conditions independently
- **Flexibility**: Multiple conditions can evaluate the same question without cluttering the original node

**Flow Example**:
```
ChoiceNode ("What's your role?")
    ↓
ConditionalNode (If role == "Developer")
    ↓ True          ↓ False
TechQuestions    BusinessQuestions
```

---

## Node Summary Table

| Section | Node Name | File | Type | Icon | Sidebar Label |
|---------|-----------|------|------|------|---------------|
| **Input/Question** | Text Input | TextInputNode.tsx | question | T | Text Input |
| **Input/Question** | Choice/Select | ChoiceNode.tsx | question | C | Choice |
| **Input/Question** | Number Input | NumberNode.tsx | question | N | Number |
| **Input/Question** | Date Input | DateNode.tsx | question | D | Date *(Not in current sidebar)* |
| **Input/Question** | Checkbox | CheckboxNode.tsx | question | B | Checkbox |
| **Blockchain** | Mint NFT | MintNFTNode.tsx | transaction | M | Mint NFT |
| **Blockchain** | Transfer SOL | TransferSOLNode.tsx | transaction | S | Transfer SOL |
| **Blockchain** | Generic Transaction | TransactionNode.tsx | transaction | Tx | Transaction |
| **Blockchain** | Call Contract | CallContractNode.tsx | transaction | Cc | Call Contract |
| **Logic** | If/Then Conditional | ConditionalNode.tsx | logic (NEW) | I | If/Then |
| **Logic** | Validation | ValidationNode.tsx | logic (NEW) | V | Validation |
| **Logic** | Calculation | CalculationNode.tsx | logic (NEW) | A | Calculation |
| **Terminal** | End Form | EndNode.tsx | end | Ef | End Form |

**Total: 13 node components across 4 functional sections**

---

## Type System Updates Required

### Files to Modify
1. **`frontend/src/types/nodes.ts`**
   - Add `'logic'` to `NodeType` union type
   - Create `LogicNodeData` interface for logic nodes
   - Add type guards: `isLogicNode()`, `isConditionalNode()`, etc.

2. **`frontend/src/components/GraphBuilder.tsx`**
   - Register logic node type in `nodeTypes` object

3. **`frontend/src/components/sidebars/LeftSidebar.tsx`**
   - Verify all 13 nodes are present in sidebar palette
   - Add Date node if desired (currently not in sidebar)

4. **`frontend/src/store/formBuilderStore.ts`**
   - Update node creation logic to handle `logic` type

import { Node } from '@xyflow/react';

// Node types
export type NodeType = 'question' | 'transaction' | 'logic' | 'end' | 'start';

// Logic node types
export type LogicType = 'conditional' | 'validation' | 'calculation';

// Condition operators for conditional logic
export type ConditionOperator = 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal';

// Single condition within a conditional node
export interface Condition {
  id: string;                    // Unique identifier for this condition
  questionId?: string;            // ID of the question to evaluate
  operator: ConditionOperator;    // Comparison operator
  comparisonValue: string;        // Value to compare against
}

// Logical operator between conditions
export type LogicOperator = 'AND' | 'OR';

// Calculation operation types
export type CalculationOperator = 'add' | 'subtract' | 'multiply' | 'divide' | 'modulo' | 'power';

// Calculation operation
export interface CalculationOperation {
  id: string;
  operator: CalculationOperator;
  operands: (string | number)[]; // Field IDs or literal numbers
  resultVariable: string;        // Name of the variable to store result
  description: string;          // Human-readable description
}

// Branch/output path configuration
export interface ConditionalBranch {
  id: string;                     // Unique identifier for this branch
  label: string;                  // Display label (e.g., "Yes", "No", "Maybe", "Option A")
  color: string;                  // Hex color for the handle (e.g., "#22c55e" for green)

  // Branch matching logic - support TWO patterns:

  // Pattern 1: Multi-branch switch (one condition, match specific values)
  matchValues?: string[];         // If the single condition result matches any of these values, take this branch

  // Pattern 2: Multi-condition logic (multiple conditions with AND/OR)
  conditions?: Condition[];       // Array of conditions for this branch
  conditionOperator?: LogicOperator; // How to combine conditions (AND/OR)
}

// Predefined color options for branch handles
export const BRANCH_COLORS = [
  { name: 'Green', value: '#22c55e' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Gray', value: '#6b7280' },
];

// Question node types
export type QuestionType = 'input' | 'choice';

// Input types for input questions
export type InputType = 'text' | 'number' | 'email' | 'phone' | 'cpf' | 'currency' | 'date' | 'custom';

// Transaction types (extensible)
export type TransactionType =
  | 'SPL_MINT'           // Legacy, keep for backward compatibility
  | 'SPL_TRANSFER'       // Existing
  | 'SYSTEM_TRANSFER'    // Existing
  | 'CUSTOM_CALL'        // Existing
  | 'CREATE_TOKEN'       // NEW
  | 'MINT_TOKENS'        // NEW
  | 'CREATE_NFT_COLLECTION'  // NEW
  | 'MINT_NFT'           // NEW
  | 'BATCH_AIRDROP';     // NEW

// Option for choice-type questions
export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

// Validation rules for question inputs
export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
}

// Cross-field validation rule types
export type ValidationRuleType =
  | 'compare'          // Compare two fields (A > B, A == B, etc.)
  | 'sum'             // Sum validation (A + B = C)
  | 'range'           // Range validation (A between B and C)
  | 'custom';         // Custom validation logic

// Cross-field validation rule
export interface ValidationRule {
  id: string;
  type: ValidationRuleType;
  description: string;        // Human-readable description
  errorMessage: string;       // Message shown when validation fails

  // Compare rule
  fieldA?: string;           // Question ID for field A
  fieldB?: string;           // Question ID for field B
  operator?: ConditionOperator; // Comparison operator

  // Sum rule
  sumFields?: string[];      // Array of question IDs to sum
  expectedSum?: number;      // Expected sum value
  targetField?: string;      // Question ID where sum should be stored

  // Range rule
  rangeField?: string;       // Question ID to check
  minValue?: number;         // Minimum allowed value
  maxValue?: number;         // Maximum allowed value

  // Custom rule
  customLogic?: string;      // Custom validation expression/logic
}

// Question node data
export interface QuestionNodeData extends Record<string, unknown> {
  questionText: string;
  questionType: QuestionType;
  inputType?: InputType; // For input type questions
  placeholder?: string;
  parameterName?: string; // Parameter name for use in transaction nodes (e.g., 'recipientAddress', 'amount')
  options?: QuestionOption[];
  multiSelect?: boolean; // For choice type: true = checkboxes, false = radio buttons
  validation?: ValidationRules;
}

// Transaction parameters based on type
export interface TransactionParameters {
  // Existing
  amount?: number;
  recipientAddress?: string;
  mintAddress?: string;
  decimals?: number;

  // Token creation
  name?: string;
  symbol?: string;
  uri?: string;
  initialSupply?: number;

  // NFT specific
  collectionAddress?: string;
  sellerFeeBasisPoints?: number;

  // Batch airdrop
  recipients?: Array<{ address: string; amount: number }>;

  [key: string]: any; // Extensibility
}

// Transaction node data
export interface TransactionNodeData extends Record<string, unknown> {
  transactionType: TransactionType;
  program: string;
  parameters: TransactionParameters;
}

// Logic node data
export interface LogicNodeData extends Record<string, unknown> {
  logicType: LogicType;

  // Pattern mode selector
  mode: 'switch' | 'multi-condition'; // Which pattern to use

  // Pattern 1: Switch mode (single question, multiple branches)
  switchQuestionId?: string;      // The question to evaluate

  // Pattern 2: Multi-condition mode (deprecated for now but kept for backward compatibility)
  questionId?: string;            // Legacy single condition support
  operator?: ConditionOperator;   // Legacy operator
  comparisonValue?: string;       // Legacy comparison value

  // Branch configuration (used by both patterns)
  branches: ConditionalBranch[];  // Output branches with conditions

  // Default branch (optional)
  defaultBranchId?: string;       // Branch to take if no conditions match
}

// Validation node data
export interface ValidationNodeData extends Record<string, unknown> {
  logicType: 'validation';
  validationRules: ValidationRule[];  // Array of validation rules to check
  blockOnFailure: boolean;           // Whether to block progression on validation failure (default: true)
}

// Calculation node data
export interface CalculationNodeData extends Record<string, unknown> {
  logicType: 'calculation';
  operations: CalculationOperation[];  // Array of calculation operations to perform
}

// Success action types for end nodes
export type SuccessActionType = 'email' | 'webhook' | 'redirect' | 'custom';

// Success action configuration
export interface SuccessAction {
  id: string;
  type: SuccessActionType;
  enabled: boolean;
  description: string;

  // Email action
  emailRecipient?: string;
  emailSubject?: string;
  emailTemplate?: string;

  // Webhook action
  webhookUrl?: string;
  webhookMethod?: 'POST' | 'PUT';
  webhookHeaders?: Record<string, string>;

  // Redirect action
  redirectUrl?: string;

  // Custom action
  customCode?: string;
}

// End node data
export interface EndNodeData extends Record<string, unknown> {
  label: string;
  message?: string;
  successActions?: SuccessAction[]; // Actions to perform when form is completed
}

// Start node data
export interface StartNodeData extends Record<string, unknown> {
   title: string;
   description: string;
   imageUrl?: string;
}

// Union of all node data types
export type NodeData = QuestionNodeData | TransactionNodeData | LogicNodeData | ValidationNodeData | CalculationNodeData | EndNodeData | StartNodeData;

// BlinkForm node extending React Flow's Node
export interface BlinkFormNode extends Node {
  type: NodeType;
  data: NodeData;
}

// Type guards
export function isQuestionNode(node: BlinkFormNode): node is BlinkFormNode & { data: QuestionNodeData } {
  return node.type === 'question';
}

export function isTransactionNode(node: BlinkFormNode): node is BlinkFormNode & { data: TransactionNodeData } {
  return node.type === 'transaction';
}

export function isEndNode(node: BlinkFormNode): node is BlinkFormNode & { data: EndNodeData } {
  return node.type === 'end';
}

export function isLogicNode(node: BlinkFormNode): node is BlinkFormNode & { data: LogicNodeData } {
  return node.type === 'logic';
}

export function isValidationNode(node: BlinkFormNode): node is BlinkFormNode & { data: ValidationNodeData } {
  return node.type === 'logic' && node.data.logicType === 'validation';
}

export function isCalculationNode(node: BlinkFormNode): node is BlinkFormNode & { data: CalculationNodeData } {
  return node.type === 'logic' && node.data.logicType === 'calculation';
}

export function isStartNode(node: BlinkFormNode): node is BlinkFormNode & { data: StartNodeData } {
  return node.type === 'start';
}

export function isCreateTokenNode(node: BlinkFormNode): boolean {
  return isTransactionNode(node) &&
    node.data.transactionType === 'CREATE_TOKEN';
}

export function isMintTokenNode(node: BlinkFormNode): boolean {
  return isTransactionNode(node) &&
    (node.data.transactionType === 'MINT_TOKENS' ||
     node.data.transactionType === 'SPL_MINT');
}

export function isCreateNftCollectionNode(node: BlinkFormNode): boolean {
  return isTransactionNode(node) &&
    node.data.transactionType === 'CREATE_NFT_COLLECTION';
}

export function isMintNftNode(node: BlinkFormNode): boolean {
  return isTransactionNode(node) &&
    node.data.transactionType === 'MINT_NFT';
}

export function isBatchAirdropNode(node: BlinkFormNode): boolean {
  return isTransactionNode(node) &&
    node.data.transactionType === 'BATCH_AIRDROP';
}

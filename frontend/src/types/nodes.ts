import { Node } from '@xyflow/react';

// Node types
export type NodeType = 'question' | 'transaction' | 'logic' | 'end';

// Question node types
export type QuestionType = 'input' | 'choice' | 'date';

// Input types for input questions
export type InputType = 'text' | 'number' | 'email' | 'phone' | 'cpf' | 'currency' | 'custom';

// Transaction types (extensible)
export type TransactionType = 'SPL_MINT' | 'SPL_TRANSFER' | 'SYSTEM_TRANSFER';

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

// Question node data
export interface QuestionNodeData extends Record<string, unknown> {
  questionText: string;
  questionType: QuestionType;
  inputType?: InputType; // For input type questions
  placeholder?: string;
  options?: QuestionOption[];
  multiSelect?: boolean; // For choice type: true = checkboxes, false = radio buttons
  validation?: ValidationRules;
}

// Transaction parameters based on type
export interface TransactionParameters {
  amount?: number;
  recipientAddress?: string;
  mintAddress?: string;
  decimals?: number;
  [key: string]: any; // Allow extensibility for custom parameters
}

// Transaction node data
export interface TransactionNodeData extends Record<string, unknown> {
  transactionType: TransactionType;
  program: string;
  parameters: TransactionParameters;
}

// End node data
export interface EndNodeData extends Record<string, unknown> {
  label: string;
  message?: string;
}

// Union of all node data types
export type NodeData = QuestionNodeData | TransactionNodeData | EndNodeData;

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

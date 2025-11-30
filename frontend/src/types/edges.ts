import { Edge } from '@xyflow/react';

// Operators for conditional logic
export type ConditionOperator = 'equals' | 'contains' | 'greater_than' | 'less_than' | 'not_equals';

// Conditional logic for edges
export interface EdgeCondition {
  expectedAnswer?: string;
  operator?: ConditionOperator;
  value?: string | number;
}

// Edge data with conditional branching
export interface ConditionalEdgeData extends Record<string, unknown> {
  condition?: EdgeCondition;
  label?: string;
}

// BlinkForm edge extending React Flow's Edge
export interface BlinkFormEdge extends Edge {
  data?: ConditionalEdgeData;
  animated?: boolean;
}

// Edge validation result
export interface EdgeValidationResult {
  isValid: boolean;
  reason?: string;
}

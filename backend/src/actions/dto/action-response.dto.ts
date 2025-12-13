/**
 * Solana Actions v2.x Response Type Definitions
 * Based on: https://solana.com/developers/guides/advanced/actions
 *
 * These types ensure compliance with the Solana Actions specification
 * and prevent the "Transaction Trap" by properly distinguishing between
 * intermediate steps (PostResponse) and final steps (TransactionResponse).
 */

/**
 * PostResponse - Used for intermediate form steps
 * Does NOT require a blockchain transaction
 * Client advances immediately to links.next
 */
export interface PostResponse {
  type: 'post';
  message?: string;
  links?: {
    next: PostNextActionLink;
  };
}

/**
 * TransactionResponse - Used for final form submission
 * Requires user to sign blockchain transaction
 * Client waits for transaction confirmation before proceeding
 */
export interface TransactionResponse {
  transaction: string; // base64-encoded serialized transaction
  message?: string;
  links?: {
    next?: PostNextActionLink | InlineNextActionLink;
  };
}

/**
 * PostNextActionLink - Callback to server for next action
 * Client POSTs to href to retrieve next question UI
 */
export interface PostNextActionLink {
  type: 'post';
  href: string;
}

/**
 * InlineNextActionLink - Embed next action directly
 * Client renders immediately without additional network call
 */
export interface InlineNextActionLink {
  type: 'inline';
  action: ActionGetResponse;
}

/**
 * ActionGetResponse - UI metadata for a Solana Action
 * Returned by GET endpoints to describe the action interface
 */
export interface ActionGetResponse {
  type?: 'action';
  icon: string;
  title: string;
  description: string;
  label: string;
  disabled?: boolean;
  links: {
    actions: Array<{
      label: string;
      href: string;
      parameters?: Array<{
        name: string;
        label?: string;
        required?: boolean;
      }>;
    }>;
  };
  error?: {
    message: string;
  };
}

/**
 * ActionPostResponse - Union type for POST responses
 * Can be either PostResponse (no transaction) or TransactionResponse
 */
export type ActionPostResponse = TransactionResponse | PostResponse;

/**
 * Type guard to check if response is PostResponse
 */
export function isPostResponse(response: ActionPostResponse): response is PostResponse {
  return (response as PostResponse).type === 'post';
}

/**
 * Type guard to check if response is TransactionResponse
 */
export function isTransactionResponse(response: ActionPostResponse): response is TransactionResponse {
  return 'transaction' in response && typeof (response as TransactionResponse).transaction === 'string';
}

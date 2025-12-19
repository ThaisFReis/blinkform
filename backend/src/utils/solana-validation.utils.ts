import { PublicKey } from '@solana/web3.js';

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Check if a value is a parameter placeholder (e.g., {{walletAddress}})
 */
export function isPlaceholder(value: string): boolean {
  if (!value) return false;
  return /^{{[a-zA-Z0-9_]+}}$/.test(value.trim());
}

/**
 * Validate Solana address with strict base58 checking
 *
 * Solana addresses are base58-encoded public keys:
 * - Exactly 32 bytes
 * - Base58 encoding results in 32-44 characters
 * - Valid characters: 1-9, A-Z, a-z (excluding 0, O, I, l)
 *
 * @param address - The address to validate
 * @returns ValidationResult with valid flag and error message if invalid
 */
export function validateSolanaAddress(address: string): ValidationResult {
  // Check for null/undefined/empty
  if (!address || typeof address !== 'string') {
    return {
      valid: false,
      error: 'Address is required'
    };
  }

  const trimmedAddress = address.trim();

  // Check if it's a placeholder - these are valid
  if (isPlaceholder(trimmedAddress)) {
    return { valid: true };
  }

  // Check length (base58-encoded 32 bytes = 32-44 characters, typically 32-44)
  if (trimmedAddress.length < 32 || trimmedAddress.length > 44) {
    return {
      valid: false,
      error: `Invalid address length (${trimmedAddress.length} characters). Solana addresses are 32-44 characters`
    };
  }

  // Check for invalid base58 characters
  // Base58 alphabet: 123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz
  // Excludes: 0, O, I, l (to avoid confusion)
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;

  if (!base58Regex.test(trimmedAddress)) {
    // Find the invalid character for better error message
    const invalidChars = trimmedAddress.split('').filter(char => !base58Regex.test(char));
    const uniqueInvalidChars = [...new Set(invalidChars)];

    if (uniqueInvalidChars.includes('0')) {
      return {
        valid: false,
        error: "Contains invalid character '0'. Solana addresses use base58 (excludes 0, O, I, l). Did you mean 'o' or 'O'?"
      };
    }
    if (uniqueInvalidChars.includes('O')) {
      return {
        valid: false,
        error: "Contains invalid character 'O'. Solana addresses use base58 (excludes 0, O, I, l). Did you mean '0'?"
      };
    }
    if (uniqueInvalidChars.includes('I')) {
      return {
        valid: false,
        error: "Contains invalid character 'I'. Solana addresses use base58 (excludes 0, O, I, l). Did you mean '1' or 'i'?"
      };
    }
    if (uniqueInvalidChars.includes('l')) {
      return {
        valid: false,
        error: "Contains invalid character 'l'. Solana addresses use base58 (excludes 0, O, I, l). Did you mean '1' or 'L'?"
      };
    }

    return {
      valid: false,
      error: `Contains invalid character(s): ${uniqueInvalidChars.join(', ')}. Solana addresses use base58 (1-9, A-Z, a-z, excluding 0, O, I, l)`
    };
  }

  // Final check: Try to create a PublicKey object
  try {
    new PublicKey(trimmedAddress);
  } catch (e) {
    return {
      valid: false,
      error: `Invalid Solana address format: ${e.message || 'Cannot parse as public key'}`
    };
  }

  return { valid: true };
}

/**
 * Validate an array of Solana addresses (for batch operations)
 *
 * @param addresses - Array of addresses to validate
 * @returns ValidationResult with valid flag and error message if any address is invalid
 */
export function validateSolanaAddresses(addresses: string[]): ValidationResult {
  if (!Array.isArray(addresses)) {
    return {
      valid: false,
      error: 'Addresses must be an array'
    };
  }

  if (addresses.length === 0) {
    return {
      valid: false,
      error: 'At least one address is required'
    };
  }

  for (let i = 0; i < addresses.length; i++) {
    const result = validateSolanaAddress(addresses[i]);
    if (!result.valid) {
      return {
        valid: false,
        error: `Address at index ${i} is invalid: ${result.error}`
      };
    }
  }

  return { valid: true };
}

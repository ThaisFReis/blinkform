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

  // Check length (base58-encoded 32 bytes = 32-44 characters)
  if (trimmedAddress.length < 32 || trimmedAddress.length > 44) {
    return {
      valid: false,
      error: `Invalid length (${trimmedAddress.length} chars). Solana addresses are 32-44 characters`
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
        error: "Contains invalid character '0'. Use base58 (excludes 0, O, I, l)"
      };
    }
    if (uniqueInvalidChars.includes('O')) {
      return {
        valid: false,
        error: "Contains invalid character 'O'. Use base58 (excludes 0, O, I, l)"
      };
    }
    if (uniqueInvalidChars.includes('I')) {
      return {
        valid: false,
        error: "Contains invalid character 'I'. Use base58 (excludes 0, O, I, l)"
      };
    }
    if (uniqueInvalidChars.includes('l')) {
      return {
        valid: false,
        error: "Contains invalid character 'l'. Use base58 (excludes 0, O, I, l)"
      };
    }

    return {
      valid: false,
      error: `Contains invalid character(s): ${uniqueInvalidChars.join(', ')}. Use base58 (1-9, A-Z, a-z, excluding 0, O, I, l)`
    };
  }

  // Frontend validation passes - backend will do final PublicKey validation
  return { valid: true };
}

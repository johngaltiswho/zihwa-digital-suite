// Encryption utilities for storing OAuth tokens securely

import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'

/**
 * Get encryption key from environment or generate one
 * In production, always set ENCRYPTION_KEY as an environment variable
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY
  if (!key) {
    throw new Error(
      'ENCRYPTION_KEY environment variable is required. ' +
        'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    )
  }

  // Key must be 32 bytes (256 bits) for AES-256
  return Buffer.from(key.slice(0, 64), 'hex')
}

/**
 * Encrypt a string using AES-256-GCM
 *
 * @param text - Plain text to encrypt
 * @returns Encrypted string (base64 encoded)
 */
export function encrypt(text: string): string {
  const key = getEncryptionKey()
  const iv = crypto.randomBytes(12) // 96 bits for GCM
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  let encrypted = cipher.update(text, 'utf8', 'base64')
  encrypted += cipher.final('base64')

  const authTag = cipher.getAuthTag()

  // Combine IV + auth tag + encrypted data
  return [iv.toString('hex'), authTag.toString('hex'), encrypted].join(':')
}

/**
 * Decrypt a string that was encrypted with encrypt()
 *
 * @param encryptedText - Base64 encoded encrypted string
 * @returns Decrypted plain text
 */
export function decrypt(encryptedText: string): string {
  const key = getEncryptionKey()
  const [ivHex, authTagHex, encrypted] = encryptedText.split(':')

  if (!ivHex || !authTagHex || !encrypted) {
    throw new Error('Invalid encrypted text format')
  }

  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(encrypted, 'base64', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

/**
 * Generate a new encryption key
 * Use this to create a key for your ENCRYPTION_KEY env var
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex')
}

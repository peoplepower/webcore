/**
 * Redact a secret for safe logging. Reveals only its length so log lines stay
 * useful for debugging without exposing the value in clear text.
 * @param {string|undefined} secret The sensitive value to redact.
 * @returns {string} A placeholder that never contains the secret itself.
 */
export function redactSecret(secret: string | undefined): string {
  return secret ? `<redacted:${secret.length} chars>` : '<none>';
}

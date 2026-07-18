const KNOWN_AUTH_ERRORS: Record<string, string> = {
  "Invalid login credentials": "invalidCredentials",
  "Email not confirmed": "emailNotConfirmed",
  "User already registered": "userAlreadyRegistered",
}

/** Maps a raw Supabase auth error message to an `auth` translation key. */
export function mapAuthError(message: string): string {
  return KNOWN_AUTH_ERRORS[message] ?? "unexpectedError"
}

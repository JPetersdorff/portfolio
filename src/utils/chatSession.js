const STORAGE_KEY = 'chatbot-session-token'

export function getSessionToken() {
  let token = sessionStorage.getItem(STORAGE_KEY)
  if (!token) {
    token = crypto.randomUUID()
    sessionStorage.setItem(STORAGE_KEY, token)
  }
  return token
}

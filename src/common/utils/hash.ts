export async function hash(text: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return hash
}

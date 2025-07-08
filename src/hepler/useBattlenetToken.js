export function getBattlenetToken() {
  const raw = localStorage.getItem('astro_battlenet_access')
  if (!raw) return null

  try {
    const data = JSON.parse(raw)
    const now = Date.now()

    if (!data.access_token || !data.expiry) return null

    if (now > data.expiry - 5 * 60 * 1000) {
      localStorage.removeItem('astro_battlenet_access')
      return null
    }

    return data.access_token
  } catch {
    return null
  }
}

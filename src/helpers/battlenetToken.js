export function getValidBattlenetToken() {
  const raw = localStorage.getItem('astro_battlenet_access')
  if (!raw) return null

  try {
    const token = JSON.parse(raw)
    if (Date.now() > token.expiry) {
      localStorage.removeItem('astro_battlenet_access')
      return null
    }
    return token.access_token
  } catch (e) {
    console.error('Failed to parse Battle.net token', e)
    localStorage.removeItem('astro_battlenet_access')
    return null
  }
}

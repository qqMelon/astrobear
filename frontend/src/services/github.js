export async function getLatestReleases() {
  const repo = 'qqMelon/keyroller'

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/releases`)
    const release = await response.json()

    if (!Array.isArray(release)) return []

    return release.map((r) => ({
      title: r.name || r.tag_name,
      date: r.published_at,
      body: r.body,
      isGithubRelease: true,
    }))
  } catch (error) {
    console.error('Error when received github releases..', error)
    return []
  }
}

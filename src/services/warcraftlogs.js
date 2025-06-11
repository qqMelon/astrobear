const CLIENT_ID = import.meta.env.VITE_WARCRAFTLOG_ID
const CLIENT_SECRET = import.meta.env.VITE_WARCRAFTLOG_SECRET
let cachedToken = null

async function getAccessToken() {
  if (cachedToken) return cachedToken

  const response = await fetch('https://www.warcraftlogs.com/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()
  cachedToken = data.access_token
  return cachedToken
}

async function getGuildProgress(difficulty) {
  const token = await getAccessToken()

  const query = `
    query {
      progressRaceData{
        progressRace(guildID: 763742, difficulty: ${difficulty})
      }
    }
  `

  const response = await fetch('https://www.warcraftlogs.com/api/v2/client', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  const json = await response.json()
  return json.data
}

async function getGuildRank() {
  const token = await getAccessToken()

  const query = `
    query {
      guildData {
        guild(id: 763742, name: "Team Sabotâche", serverSlug: "Hyjal", serverRegion: "eu") {
          name
          zoneRanking {
            progress {
              regionRank{
                number
                color
              }
              serverRank {
                number
                color
              }
            }
            speed {
              regionRank{
                number
                color
              }
              serverRank {
                number
                color
              }
            }
          }
        }
      }
    }
  `

  const response = await fetch('https://www.warcraftlogs.com/api/v2/client', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  const json = await response.json()
  return json.data.guildData
}

function difficultyLabels(difficulty) {
  const difficulties = {
    1: 'LFR',
    2: 'Normal',
    3: 'Heroic',
    4: 'Mythic',
  }

  return difficulties[difficulty] || 'Unknown'
}

export { getGuildRank, getGuildProgress }

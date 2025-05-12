const fetch = require('node-fetch');

module.exports = function registerEndpoint(router, { services, env }) {
  const { UsersService } = services;

  router.post('/', async (req, res) => {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Missing OAuth code' });
    }

    const accessTokenRes = await fetch('https://oauth.battle.net/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${env.BATTLENET_CLIENT_ID}:${env.BATTLENET_CLIENT_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${env.BATTLENET_REDIRECT_URI}`,
    });

    const tokenData = await accessTokenRes.json();

    if (!tokenData.access_token) {
      return res.status(400).json({ error: 'Failed to fetch Battle.net access token', details: tokenData });
    }

    const user = req.accountability?.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // On enregistre l'access_token dans une colonne custom (ex: battlenet_token)
    const usersService = new UsersService({ schema: req.schema });
    await usersService.updateOne(user, {
      battlenet_token: tokenData.access_token,
    });

    return res.json({ success: true });
  });
};


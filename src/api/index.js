const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('homebridge-automation-presence/api');

module.exports = (host, port, hooks) => {
  const app = express();

  app.disable('x-powered-by');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));

  app.get('/state', async (req, res) => {
    debug('GET /state');
    const status = await hooks.getState();
    res.json({ success: true, status});
  });

  app.post('/state', async (req, res) => {
    const { zoneId, triggerId, triggered } = req.body;
    debug(`POST /state -- ${JSON.stringify({ zoneId, triggerId, triggered })}`);

    await hooks.setState(zoneId, triggerId, triggered);
    res.json({ success: true });
  });

  app.listen(port, host, () => debug(`API running on ${host}:${port}`));
};

const serverless = require('serverless-http');
const app = require('../../server/app');
const { initDb } = require('../../server/db');
const seed = require('../../server/seed');

const handler = serverless(app);
let ready;

exports.handler = async (event, context) => {
  ready = ready || initDb().then(seed);
  await ready;
  return handler(event, context);
};

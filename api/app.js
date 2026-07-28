const fs = require('fs');
const path = require('path');
const { requireAuth } = require('./_auth');

module.exports = function handler(req, res) {
  if (!requireAuth(req, res)) return;
  const html = fs.readFileSync(path.join(__dirname, 'app.html'), 'utf8');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
};

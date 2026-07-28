// Vercel Serverless Function
// Brauzerdan kelgan so'rovni server tomonidan graph.facebook.com'ga yuboradi.
// Bu CORS muammosini butunlay bartaraf etadi, chunki brauzer faqat
// o'zining domenidagi /api/proxy manziliga so'rov yuboradi (same-origin),
// Facebook'ga so'rov esa server-server tarzda amalga oshadi.

const accounts = require('./accounts-config');
const { requireAuth } = require('./_auth');

module.exports = async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  // Oddiy CORS sarlavhalari (agar boshqa domendan chaqirilsa ham ishlashi uchun)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: { message: 'Faqat POST so\'rovlar qabul qilinadi' } });
    return;
  }

  try {
    const { path, method = 'GET', params = {}, apiVersion = 'v19.0', domain = 'graph.facebook.com', accountKey } = req.body || {};

    if (!path) {
      res.status(400).json({ error: { message: '"path" maydoni kerak' } });
      return;
    }

    let finalDomain = domain;
    let finalParams = { ...params };
    let finalPath = path;

    if (accountKey) {
      // Oldindan sozlangan akkaunt tanlangan — token va ID'ni serverdagi
      // yashirin konfiguratsiyadan olamiz, brauzer ularni bilmaydi ham.
      const account = accounts.find(a => a.key === accountKey);
      if (!account || !account.token || !account.igUserId) {
        res.status(400).json({ error: { message: 'Bu akkaunt uchun token/ID hali sozlanmagan' } });
        return;
      }
      finalDomain = account.domain || 'graph.instagram.com';
      finalParams.access_token = account.token;
      finalPath = finalPath.replace('{ig-id}', account.igUserId);
    }

    const allowedDomains = ['graph.facebook.com', 'graph.instagram.com'];
    if (!allowedDomains.includes(finalDomain)) {
      res.status(400).json({ error: { message: 'Ruxsat etilmagan domen' } });
      return;
    }

    const url = new URL(`https://${finalDomain}/${apiVersion}${finalPath}`);
    const fetchOpts = { method };

    if (method === 'GET') {
      Object.entries(finalParams).forEach(([k, v]) => url.searchParams.set(k, v));
    } else {
      const body = new URLSearchParams(finalParams);
      fetchOpts.body = body;
      fetchOpts.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    }

    const fbRes = await fetch(url.toString(), fetchOpts);
    const data = await fbRes.json();
    res.status(fbRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: { message: err.message || 'Noma\'lum server xatosi' } });
  }
}

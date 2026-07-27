// Vercel Serverless Function
// Brauzerdan kelgan so'rovni server tomonidan graph.facebook.com'ga yuboradi.
// Bu CORS muammosini butunlay bartaraf etadi, chunki brauzer faqat
// o'zining domenidagi /api/proxy manziliga so'rov yuboradi (same-origin),
// Facebook'ga so'rov esa server-server tarzda amalga oshadi.

export default async function handler(req, res) {
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
    const { path, method = 'GET', params = {}, apiVersion = 'v19.0', domain = 'graph.facebook.com' } = req.body || {};

    if (!path) {
      res.status(400).json({ error: { message: '"path" maydoni kerak' } });
      return;
    }

    const allowedDomains = ['graph.facebook.com', 'graph.instagram.com'];
    if (!allowedDomains.includes(domain)) {
      res.status(400).json({ error: { message: 'Ruxsat etilmagan domen' } });
      return;
    }

    const url = new URL(`https://${domain}/${apiVersion}${path}`);
    const fetchOpts = { method };

    if (method === 'GET') {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    } else {
      const body = new URLSearchParams(params);
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

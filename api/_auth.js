// Barcha himoyalangan endpoint'lar shu yordamchi funksiyani ishlatadi.
// Login/parol Vercel muhit o'zgaruvchilarida saqlanadi (AUTH_USER, AUTH_PASS) —
// kodning ichida yoki brauzerda emas.

function isAuthorized(req) {
  const expectedUser = process.env.AUTH_USER || '';
  const expectedPass = process.env.AUTH_PASS || '';

  // Agar admin AUTH_USER/AUTH_PASS'ni sozlamagan bo'lsa, xato qilib qulflab
  // qo'ymaslik uchun ochiq qoldiramiz — lekin bu holatni README'da alohida
  // ta'kidlaymiz, chunki bu himoyasiz degani.
  if (!expectedUser || !expectedPass) return true;

  const authHeader = req.headers['authorization'] || '';
  if (!authHeader.startsWith('Basic ')) return false;

  const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf8');
  const sepIndex = decoded.indexOf(':');
  if (sepIndex === -1) return false;

  const user = decoded.slice(0, sepIndex);
  const pass = decoded.slice(sepIndex + 1);
  return user === expectedUser && pass === expectedPass;
}

function requireAuth(req, res) {
  if (isAuthorized(req)) return true;
  res.setHeader('WWW-Authenticate', 'Basic realm="IG Publisher"');
  res.status(401).send('Kirish uchun login va parol kerak.');
  return false;
}

module.exports = { isAuthorized, requireAuth };

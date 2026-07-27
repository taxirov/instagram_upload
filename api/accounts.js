const accounts = require('./accounts-config');

// Faqat "key" va "name" (viloyat nomi) brauzerga yuboriladi.
// "token" va "igUserId" hech qachon shu javobda chiqmaydi — ular faqat
// proxy.js ichida, server tomonida ishlatiladi.
module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const safeList = accounts
    .filter(a => a.igUserId && a.token) // hali to'ldirilmagan akkauntlarni ro'yxatda ko'rsatmaydi
    .map(a => ({ key: a.key, name: a.name }));
  res.status(200).json({ accounts: safeList });
};

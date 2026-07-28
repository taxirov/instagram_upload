const { handleUpload } = require('@vercel/blob/client');
const { requireAuth } = require('./_auth');

module.exports = async function handler(req, res) {
  if (!requireAuth(req, res)) return;

  // handleUpload so'rovdan faqat sarlavhalarni .get() usuli orqali o'qiydi
  // (Web API Request uslubida), Node'ning haqiqiy so'rovi esa oddiy obyekt
  // bo'lgani uchun shunga mos "shim" (moslashtiruvchi qobiq) bilan o'raymiz.
  const requestShim = {
    headers: {
      get: (name) => req.headers[String(name).toLowerCase()] || null,
    },
  };

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: requestShim,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/x-m4v', 'video/webm'],
        addRandomSuffix: true,
        // Video fayllar odatda katta bo'ladi — 1 GB gacha ruxsat beramiz.
        maximumSizeInBytes: 1024 * 1024 * 1024,
      }),
      onUploadCompleted: async () => {
        // Hozircha qo'shimcha loglash shart emas.
      },
    });

    res.status(200).json(jsonResponse);
  } catch (error) {
    res.status(400).json({ error: (error && error.message) || 'Yuklashda xato' });
  }
};

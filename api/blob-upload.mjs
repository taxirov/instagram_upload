export const config = { runtime: 'edge' };

import { handleUpload } from '@vercel/blob/client';

// Edge funksiya Web API Request/Response bilan ishlaydi, shuning uchun
// login/parol tekshiruvi shu yerda alohida (Node'dagi _auth.js'dan farqli) yozilgan.
function isAuthorized(request) {
  const expectedUser = process.env.AUTH_USER || '';
  const expectedPass = process.env.AUTH_PASS || '';
  if (!expectedUser || !expectedPass) return true;

  const authHeader = request.headers.get('authorization') || '';
  if (!authHeader.startsWith('Basic ')) return false;

  const decoded = atob(authHeader.slice(6));
  const sepIndex = decoded.indexOf(':');
  if (sepIndex === -1) return false;

  const user = decoded.slice(0, sepIndex);
  const pass = decoded.slice(sepIndex + 1);
  return user === expectedUser && pass === expectedPass;
}

export default async function handler(request) {
  if (!isAuthorized(request)) {
    return new Response('Kirish uchun login va parol kerak.', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="IG Publisher"' },
    });
  }

  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
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

    return new Response(JSON.stringify(jsonResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Yuklashda xato' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

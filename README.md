# IG Publisher — Vercel'da joylashtirish

Bu papkada 2 narsa bor:
- `index.html` — asosiy sahifa (forma, jarayon, konsol)
- `api/proxy.js` — Vercel serverless funksiya, u brauzer o'rniga Facebook Graph API'ga so'rov yuboradi (shuning uchun CORS chiqmaydi)

## 1-usul: Vercel CLI orqali (eng tez, GitHub shart emas)

1. Node.js o'rnatilgan bo'lishi kerak.
2. Shu papka ichida terminalda:
   ```
   npx vercel
   ```
3. Savollarga javob bering (Vercel akkauntga kirish so'raladi — bepul ro'yxatdan o'tish mumkin).
4. Tugagach, `npx vercel --prod` bilan doimiy (production) manzil olasiz, masalan:
   `https://ig-publisher-sizning-nom.vercel.app`

## 2-usul: GitHub orqali

1. Shu papkani yangi GitHub repozitoriyga yuklang.
2. https://vercel.com → **Add New Project** → repozitoriyni tanlang → **Deploy**.
3. Hech qanday qo'shimcha sozlash kerak emas (Framework: "Other" / zero-config yetarli).
4. Deploy tugagach sizga `https://....vercel.app` manzili beriladi.

## Ishlatish

1. Berilgan `.vercel.app` manzilini brauzerda oching.
2. Instagram Business Account ID va Access Token'ni kiriting.
3. "Tokenni tekshirish" tugmasi bilan tokenni tasdiqlang.
4. Video URL (ochiq/public link) va caption kiriting, "Yuklashni boshlash" tugmasini bosing.

## Eslatma

- Token endi ham faqat brauzer xotirasida turadi — `api/proxy.js` uni hech qayerda saqlamaydi, faqat Facebook'ga uzatib, javobni qaytaradi.
- Agar boshqacha xatolik chiqsa (masalan token huquqlari yetarli emas), konsol jurnalida Facebook'ning aniq xato xabari ko'rinadi.

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

## Token qayerdan olinganini to'g'ri tanlash

Meta Developer Console'da 2 xil joydan token olish mumkin, va ular boshqa-boshqa domenlarda ishlaydi:

- **"API setup with Instagram login"** sahifasidagi har bir akkaunt qatoridagi **"Generate token"** — bu Instagram Login orqali olingan token, `graph.instagram.com`da ishlaydi, odatda `IGAA...` bilan boshlanadi. Shu qatordagi raqam (masalan `17841474899465035`) — Instagram Business Account ID.
- **Business Manager / Facebook Page** orqali olingan Page Access Token — `graph.facebook.com`da ishlaydi, odatda `EAA...` bilan boshlanadi.

Sahifadagi **"Token qayerdan olingan"** tanlovini shunga mos tanlang — aks holda "Cannot parse access token" xatosi chiqadi.

## Viloyat bo'yicha tez tanlash (yangi)

Sahifada endi **"ID va tokenni interfeysdan qo'lda kiritish"** degan tugma (checkbox) bor:

- **O'chirilgan holatda (default)** — "Viloyat (kanal)" ro'yxatidan kerakli akkauntni tanlaysiz, token va ID hech qayerga kiritilmaydi. Bu ma'lumotlar `api/accounts-config.js` faylida, faqat serverda saqlanadi va brauzerga umuman yuborilmaydi.
- **Yoqilgan holatda** — avvalgidek, ID va tokenni qo'lda kiritasiz (bir martalik yoki test uchun qulay).

### 14 akkauntni qanday to'ldirish kerak

`api/accounts-config.js` faylini oching, har bir viloyat qatoridagi `igUserId: ''` va `token: ''`ni haqiqiy qiymatlar bilan to'ldiring:

```js
{ key: 'xorazm', name: 'Xorazm', igUserId: '25080941444927104', token: 'IGAA...', domain: 'graph.instagram.com' },
```

To'ldirilmagan (bo'sh `igUserId`/`token`) qatorlar "Viloyat" ro'yxatida ko'rinmaydi — shuning uchun hech narsani o'chirib qo'yish shart emas, faqat bor ma'lumotlarni kiriting.

## Login va parol bilan himoyalash (yangi)

Sayt endi login/parolsiz ochilmaydi — brauzerning o'zining standart login oynasi chiqadi.

**Sozlash (deploy qilishdan oldin yoki keyin):**

1. Vercel loyihasida: **Settings → Environment Variables**
2. Ikkita o'zgaruvchi qo'shing:
   - `AUTH_USER` — login (masalan `admin`)
   - `AUTH_PASS` — parol (masalan `Kuchli-Parol-2026`)
3. Saqlagach, loyihani **qayta deploy** qiling (`npx vercel --prod` yoki Vercel Dashboard'da "Redeploy"), aks holda eski deploy yangi o'zgaruvchini ko'rmaydi.

Shundan keyin sayt manzilini ochganda brauzer login/parol so'raydi. To'g'ri kiritilgach, brauzer odatda shu ma'lumotlarni sessiya davomida eslab qoladi.

**Diqqat:** agar `AUTH_USER`/`AUTH_PASS` sozlanmagan bo'lsa, sayt xavfsizlik uchun ataylab **ochiq** qoladi (login so'ramaydi) — shuni unutmang, albatta ikkalasini ham to'ldiring.

CLI orqali tezroq sozlash:
```
npx vercel env add AUTH_USER production
npx vercel env add AUTH_PASS production
npx vercel --prod
```

## Ishlatish

1. Berilgan `.vercel.app` manzilini brauzerda oching.
2. "Viloyat (kanal)" ro'yxatidan kerakli akkauntni tanlang (yoki qo'lda kiritish tugmasini yoqing).
3. Video URL (ochiq/public link) va caption kiriting, "Yuklashni boshlash" tugmasini bosing.

## Eslatma

- Token endi ham faqat brauzer xotirasida turadi — `api/proxy.js` uni hech qayerda saqlamaydi, faqat Facebook'ga uzatib, javobni qaytaradi.
- Agar boshqacha xatolik chiqsa (masalan token huquqlari yetarli emas), konsol jurnalida Facebook'ning aniq xato xabari ko'rinadi.

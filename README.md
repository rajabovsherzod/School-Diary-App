# School Diary App

School Diary - bu maktab kundaligi tizimini boshqarish uchun mo'ljallangan to'liq (full-stack) veb-ilova. Bu ilova o'qituvchilarga sinflar, fanlar, o'quvchilar va dars jadvallarini osonlik bilan boshqarish imkonini beradi.

## Texnologiyalar To'plami (Tech Stack)

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM
- **Ma'lumotlar bazasi**: PostgreSQL (Docker yordamida)

---

## Loyihani Ishga Tushirish

Ushbu yo'riqnoma ma'lumotlar bazasini Docker yordamida, backend va frontendni esa lokal kompyuterda ishga tushirishni ko'rsatadi.

### 1. Talablar

- [Node.js](https://nodejs.org/en/) (v18 yoki undan yuqori)
- `npm` (Node.js bilan birga keladi)
- [Docker](https://www.docker.com/products/docker-desktop/)

### 2. Loyihani Yuklab Olish

```bash
git clone https://github.com/rajabovsherzod/School-Diary-App.git
cd School-Diary-App
```

### 3. Ma'lumotlar Bazasini Ishga Tushirish (Docker orqali)

1.  `backend` papkasiga o'ting:
    ```bash
    cd backend
    ```
2.  PostgreSQL ma'lumotlar bazasi konteynerini fon rejimida ishga tushiring:
    ```bash
    docker-compose up -d
    ```
    Bu buyruq `backend/docker-compose.yml` faylini ishlatib, `kundalik_db` nomli konteyner yaratadi. Ma'lumotlar bazasi endi `localhost:5432` portida ishlaydi.

### 4. Backend Serverini Sozlash va Ishga Tushirish (Lokal)

1.  Hozir siz `backend` papkasida bo'lishingiz kerak. Kerakli paketlarni o'rnating:
    ```bash
    npm install
    ```
2.  `.env.example` faylidan nusxa olib, `.env` faylini yarating. Undagi `DATABASE_URL` Docker orqali ishlayotgan ma'lumotlar bazasiga to'g'ri kelishi kerak (odatda standart sozlamalarni o'zgartirish shart emas).
    ```bash
    cp .env.example .env
    ```
3.  Prisma schemani ma'lumotlar bazasiga qo'llang:
    ```bash
    npx prisma db push
    ```
4.  Backend serverini ishga tushiring:
    ```bash
    npm run dev
    ```
    Backend endi `localhost:3002` portida ishlaydi.

### 5. Frontend Ilovasini Ishga Tushirish (Lokal)

1.  Yangi terminal oching va loyihaning asosiy papkasidan `client` papkasiga o'ting:
    ```bash
    cd client
    ```
2.  Kerakli paketlarni o'rnating:
    ```bash
    npm install
    ```
3.  Frontend ilovasini ishga tushiring:
    ```bash
    npm run dev
    ```
    Frontend endi [http://localhost:3000](http://localhost:3000) manzilida ochiladi.

---

### Loyihani To'xtatish

1.  Backend va frontend ishlayotgan terminallarda `Ctrl + C` tugmalarini bosing.
2.  Ma'lumotlar bazasi konteynerini to'xtatish uchun `backend` papkasida quyidagi buyruqni bajaring:
    ```bash
    docker-compose down
    ```

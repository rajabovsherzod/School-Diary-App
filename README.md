# School Diary App

School Diary - bu maktab kundaligi tizimini boshqarish uchun mo'ljallangan to'liq (full-stack) veb-ilova. Bu ilova o'qituvchilarga sinflar, fanlar, o'quvchilar va dars jadvallarini osonlik bilan boshqarish imkonini beradi.

## Texnologiyalar To'plami (Tech Stack)

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM
- **Ma'lumotlar bazasi**: PostgreSQL

---

## Ishga Tushirish (Setup)

Loyihani ikki xil usulda ishga tushirish mumkin: Docker orqali (tavsiya etiladi) yoki lokal kompyuterda.

### 1. Docker orqali Ishga Tushirish (Tavsiya Etiladi)

Bu eng oson va qulay usul. Faqat [Docker](https://www.docker.com/products/docker-desktop/) o'rnatilgan bo'lishi kerak.

1.  `.env` faylini yarating. `backend` papkasidagi `.env.example` faylidan nusxa oling va loyihaning asosiy papkasiga (`root`) joylashtiring.

    ```bash
    cp backend/.env.example .env
    ```

    Bu fayl `docker-compose.yml` tomonidan ishlatiladi. Kerak bo'lsa, o'zgarish kiritishingiz mumkin.

2.  Loyihani ishga tushiring:

    ```bash
    docker-compose up --build -d
    ```

    `-d` flugi terminallarni bloklamasdan, fon rejimida ishga tushiradi.

3.  Birinchi marta ishga tushganda, ma'lumotlar bazasi scheemasini qo'llash uchun alohida terminalda quyidagi buyruqni bajaring:
    ```bash
    docker-compose exec backend npx prisma db push
    ```

Endi frontend [http://localhost:3000](http://localhost:3000) manzilida, backend esa [http://localhost:5000](http://localhost:5000) manzilida ishlaydi.

Loyihani to'xtatish uchun:

```bash
docker-compose down
```

### 2. Lokal Ishga Tushirish (Docker'siz)

#### Talablar

- [Node.js](https://nodejs.org/en/) (v18 yoki undan yuqori)
- `npm` (Node.js bilan birga keladi)
- [PostgreSQL](https://www.postgresql.org/download/) ma'lumotlar bazasi

#### Backend Sozlamalari

1.  Backend papkasiga o'ting:

    ```bash
    cd backend
    ```

2.  Kerakli paketlarni o'rnating:

    ```bash
    npm install
    ```

3.  `.env.example` faylidan nusxa olib, `.env` faylini yarating va uni o'zingizning ma'lumotlar bazasi sozlamalaringiz bilan to'ldiring:

    ```bash
    cp .env.example .env
    ```

4.  Prisma schemani ma'lumotlar bazasiga qo'llang:

    ```bash
    npx prisma db push
    ```

5.  Backend serverini ishga tushiring:
    ```bash
    npm run dev
    ```

#### Frontend Sozlamalari

1.  Alohida terminal ochib, client papkasiga o'ting:

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

Endi ilova [http://localhost:3000](http://localhost:3000) manzilida ochilishi kerak.

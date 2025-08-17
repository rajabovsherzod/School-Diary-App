# School Diary App

School Diary - bu maktab kundaligi tizimini boshqarish uchun mo'ljallangan to'liq (full-stack) veb-ilova. Bu ilova o'qituvchilarga sinflar, fanlar, o'quvchilar va dars jadvallarini osonlik bilan boshqarish imkonini beradi.

## Texnologiyalar To'plami (Tech Stack)

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM
- **Ma'lumotlar bazasi**: PostgreSQL (tavsiya etiladi)

## Lokal Ishga Tushirish (Local Setup)

Loyihani o'z kompyuteringizda ishga tushirish uchun quyidagi qadamlarni bajaring:

### 1. Talablar

- [Node.js](https://nodejs.org/en/) (v18 yoki undan yuqori)
- [pnpm](https://pnpm.io/installation) (yoki npm/yarn)
- [PostgreSQL](https://www.postgresql.org/download/) ma'lumotlar bazasi

### 2. Loyihani Yuklab Olish

```bash
git clone https://github.com/rajabovsherzod/School-Diary-App.git
cd School-Diary-App
```

### 3. Backend Sozlamalari

1.  Backend papkasiga o'ting:

    ```bash
    cd backend
    ```

2.  Kerakli paketlarni o'rnating:

    ```bash
    pnpm install
    ```

3.  `.env.example` faylidan nusxa olib, `.env` faylini yarating va uni o'zingizning ma'lumotlar bazasi sozlamalaringiz bilan to'ldiring:

    ```bash
    cp .env.example .env
    ```

4.  Prisma schemani ma'lumotlar bazasiga qo'llang:

    ```bash
    pnpm prisma db push
    ```

5.  Backend serverini ishga tushiring:
    ```bash
    pnpm dev
    ```

### 4. Frontend Sozlamalari

1.  Alohida terminal ochib, client papkasiga o'ting:

    ```bash
    cd client
    ```

2.  Kerakli paketlarni o'rnating:

    ```bash
    pnpm install
    ```

3.  Frontend ilovasini ishga tushiring:
    ```bash
    pnpm dev
    ```

Endi ilova [http://localhost:3000](http://localhost:3000) manzilida ochilishi kerak.

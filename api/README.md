# Hapi API

This is the API for the web application and fetching the stock data utilising the IEXCloud API.

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Build the API

```bash
npm run build
```

3. Create a .env file in the root directory with the following contents:

```env
DATABASE_URL="file:./dev.db"
```

4. Create the database

```bash
npx prisma generate
npx prisma db push
```

5. Run the API server

```bash
npm run start
```

## Fetching historical data

Build the API following the previous steps and then run the following command:

```bash
node ./build/iexcloud/historical.js
```

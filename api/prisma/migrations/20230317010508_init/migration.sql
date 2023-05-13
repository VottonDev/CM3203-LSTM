-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "emailToken" TEXT,
    "expiration" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "HistoricalPrice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "priceDate" DATETIME NOT NULL,
    "open" REAL NOT NULL,
    "high" REAL NOT NULL,
    "low" REAL NOT NULL,
    "close" REAL NOT NULL,
    "volume" INTEGER NOT NULL,
    "stockId" INTEGER NOT NULL,
    CONSTRAINT "HistoricalPrice_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CurrentPrice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "latestTime" DATETIME NOT NULL,
    "latestPrice" REAL NOT NULL,
    "open" REAL NOT NULL,
    "high" REAL NOT NULL,
    "low" REAL NOT NULL,
    "close" REAL NOT NULL,
    "volume" INTEGER NOT NULL,
    "avgTotalVolume" INTEGER NOT NULL,
    "previousClose" REAL NOT NULL,
    "week52High" REAL NOT NULL,
    "week52Low" REAL NOT NULL,
    "ytdChange" REAL NOT NULL,
    "stockId" INTEGER NOT NULL,
    CONSTRAINT "CurrentPrice_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Prediction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" REAL NOT NULL,
    "stockId" INTEGER NOT NULL,
    "typeOfPrediction" TEXT NOT NULL,
    CONSTRAINT "Prediction_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Token_emailToken_key" ON "Token"("emailToken");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_name_key" ON "Stock"("name");

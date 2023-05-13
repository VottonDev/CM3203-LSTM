import client from '../../common/iexcloud.js';
import prisma from '../../common/prisma.js';

async function fetchCurrentData(key: string, workspace: string, id: string) {
  const data = await client.apperate.queryData({ key, workspace, id });

  console.log(`Fetched current data for ${key}`);

  for (const priceData of data) {
    const stock = await prisma.stock.upsert({
      where: { name: priceData.symbol },
      update: {},
      create: { name: priceData.symbol },
    });

    await prisma.currentPrice.create({
      data: {
        latestTime: new Date(priceData.latestTime),
        latestPrice: priceData.latestPrice,
        open: priceData.open,
        high: priceData.high,
        low: priceData.low,
        close: priceData.close,
        volume: priceData.volume,
        avgTotalVolume: priceData.avgTotalVolume,
        previousClose: priceData.previousClose,
        week52High: priceData.week52High,
        week52Low: priceData.week52Low,
        ytdChange: priceData.ytdChange,
        stock: { connect: { id: stock.id } },
      },
    });
  }
}

fetchCurrentData('APPL', 'CORE', 'QUOTE');

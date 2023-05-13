import client from '../../common/iexcloud.js';
import fs from 'fs';
import prisma from '../../common/prisma.js';

// Fetch historical data for a symbol and save into json file and database. Get data from 2021 till now.
async function fetchHistoricalData(key: string, workspace: string, id: string, from: string, to: string) {
  const data = await client.apperate.queryData({ key, workspace, id, from, to });

  for (const priceData of data) {
    const stock = await prisma.stock.upsert({
      where: { name: priceData.symbol },
      update: {},
      create: { name: priceData.symbol },
    });

    await prisma.historicalPrice.create({
      data: {
        priceDate: new Date(priceData.priceDate),
        open: priceData.open,
        high: priceData.high,
        low: priceData.low,
        close: priceData.close,
        volume: priceData.volume,
        stock: { connect: { id: stock.id } },
      },
    });
  }

  fs.readFile('historical.json', function (err, json) {
    if (err) {
      // If there's an error reading the file, write new data to it and log success/error
      fs.writeFile('historical.json', JSON.stringify(data), function (err) {
        if (err) {
          console.error('Error writing file:', err);
        } else {
          console.log('New file created and saved!');
        }
      });
    } else {
      // If file exists, parse the JSON data and check for updates
      const jsonFile = JSON.parse(json.toString());
      if (jsonFile.length > 0) {
        // Get the latest date in the existing data
        const latestDate = new Date(jsonFile[0].priceDate);
        // Filter the new data to include only items with a date after the latest one in the file
        const newData = data.filter((item: any) => new Date(item.priceDate) > latestDate);
        // Merge the filtered new data with the existing data and write to the file
        fs.writeFile('historical.json', JSON.stringify([...newData, ...jsonFile]), function (err) {
          if (err) {
            console.error('Error writing file:', err);
          } else {
            console.log('Data appended to file and saved!');
          }
        });
      } else {
        // If file is empty, write new data to it
        fs.writeFile('historical.json', JSON.stringify(data), function (err) {
          if (err) {
            console.error('Error writing file:', err);
          } else {
            console.log('New data saved to file!');
          }
        });
      }
    }
  });
}

// Fetch 1 year of historical data for AAPL. Stock, Catalog, Category, From, To
fetchHistoricalData('AAPL', 'CORE', 'HISTORICAL_PRICES', '2022-02-26', '2023-05-04');

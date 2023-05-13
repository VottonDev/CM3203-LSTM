import EventSource from 'eventsource';
import fs from 'fs';
import processFile from './processrealtime.js';

const url = 'https://cloud-sse.iexapis.com/v1/stocksUSNoUTP1Minute?token=pk_7d141bac1055497daaff5936aee7ed9f&symbols=AAPL';

const headers = { headers: { Accept: 'text/event-stream' } };
const source = new EventSource(url, headers);

source.onopen = () => {
  console.log('SSE connection opened');
};

source.onerror = (error) => {
  console.error('SSE error:', error);
};

source.addEventListener('message', (message) => {
  try {
    const data = JSON.parse(message.data.replace(/[\u0000-\u0019]+/g, '')); // Remove anomaly characters
    // Save the data into a JSON file, if the data is already in the file, don't save it again, use latestUpdate to check if the data is already in the file.
    fs.readFile('realtime.json', function (err, json) {
      if (err) {
        // If there's an error reading the file, write new data to it and log success/error
        fs.writeFile('realtime.json', JSON.stringify([data]), function (err) {
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
          // Get the latest update date in the existing data
          const latestDate = new Date(jsonFile[0].latestUpdate);
          // Filter the new data to include only items with an update date after the latest one in the file
          const newData = data.filter((item: any) => new Date(item.latestUpdate) > latestDate);
          // Merge the filtered new data with the existing data and write to the file
          fs.writeFile('realtime.json', JSON.stringify([...newData, ...jsonFile]), function (err) {
            if (err) {
              console.error('Error writing file:', err);
            } else {
              console.log('Data appended to file and saved!');
            }
          });
        } else {
          // If file is empty, write new data to it
          fs.writeFile('realtime.json', JSON.stringify([data]), function (err) {
            if (err) {
              console.error('Error writing file:', err);
            } else {
              console.log('New data saved to file!');
            }
          });
        }
      }
    });
  } catch (e) {
    console.error('Error parsing JSON:', e);
  }
});

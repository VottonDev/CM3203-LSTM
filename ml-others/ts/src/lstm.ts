import fs from 'fs';
import brain from 'brain.js';

// Predict the next day's closing price.
function predict() {
    // Read JSON file.
    const data = fs.readFileSync('historical.json');

    // Parse JSON data.
    const json = JSON.parse(data.toString());

    // Read the data from the bottom to the top.
    json.reverse();

    // Get the data we need.
    const close = json.map((item: { fclose: any; }) => item.fclose);
    const high = json.map((item: { fhigh: any; }) => item.fhigh);
    const low = json.map((item: { flow: any; }) => item.flow);
    const open = json.map((item: { fopen: any; }) => item.fopen);
    const volume = json.map((item: { fvolume: any; }) => item.fvolume);

    // Scale the data.
    const closeScaled = close.map((item: number) => item / 100);
    const highScaled = high.map((item: number) => item / 100);
    const lowScaled = low.map((item: number) => item / 100);
    const openScaled = open.map((item: number) => item / 100);
    const volumeScaled = volume.map((item: number) => item / 100);

    // Create an artificial neural network and use the previous data to train it to predict the next day's closing price.
    const net = new brain.recurrent.LSTMTimeStep();

    net.train([
        closeScaled,
        highScaled,
        lowScaled,
        openScaled,
        volumeScaled
    ], {
        learningRate: 0.005,
        errorThresh: 0.02,
        iterations: 1000,
        log: (stats: any) => console.log(stats)
    });

    // Save the trained neural network.
    const jsonNet = net.toJSON();
    fs.writeFileSync('net.json', JSON.stringify(jsonNet));

    // Predict the next day's closing price.
    const output = net.forecast(closeScaled, 1);

    // Print the prediction. Scale it back up.
    console.log(output * 100);
}

predict();
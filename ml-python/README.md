# LSTM Algorithm for Time Series Prediction in Python

This algorithm uses a stock's historical or real-time data to predict the future stock price using LSTM algorithm. The algorithm is written in Python from scratch utilising Numpy to perform the mathematical operations to implement the LSTM algorithm.

## Requirements
`Python 3.11`<br>
`Numpy`<br>
`Pandas`<br>
`Matplotlib`

## Usage
The `main()` function is the entry point of the algorithm. It takes the following parameters:

`stock_symbol`: the stock symbol of the company to predict the stock price for (e.g. 'AAPL' for Apple Inc.)<br>
`epochs`: the number of training epochs. The more epochs, the more accurate the prediction will be, but the longer it will take to train the model.<br>
`training_percentage`: the percentage of the data to use for training (Default 80%). The rest will be used for testing.<br>
`plot_days`: the number of days to predict the stock price for, starting from the last day in the training data.<br>
`save_model`: whether to save the trained model into a numpy .npz file (Weights and biases)<br>
`live_data`: whether to predict the stock price using historical data or real-time data.
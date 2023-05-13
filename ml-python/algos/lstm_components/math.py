import numpy as np


# Sigmoid activation function
def sigmoid(x):
    return 1 / (1 + np.exp(-x))


# Tanh activation function
def tanh(x):
    return 1 - np.square(np.tanh(x))


# MSE (Mean Squared Error)
def mse(actual, prediction):
    return np.mean((actual - prediction) ** 2) / 1000


# RMSE (Root Mean Squared Error)
def rmse(actual, prediction):
    return np.sqrt(mse(actual, prediction)) / 1000


# MAE (Mean Absolute Error)
def mae(actual, prediction):
    return np.mean(np.abs(actual - prediction)) / 1000


# MAPE (Mean Absolute Percentage Error)
def mape(actual, prediction):
    mask = actual != 0
    return np.mean(np.abs((actual - prediction)[mask] / actual[mask])) * 100 / 1000


# R2 (R Squared)
def r2(actual, prediction):
    return 1 - (np.sum(np.square(actual - prediction)) / np.sum(np.square(actual - np.mean(actual)))) / 1000

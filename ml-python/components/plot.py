import matplotlib.pyplot as plt
import numpy as np


# Plot the data
def plot(actual, train, test, accuracy, figsize=(10, 6), xlabel="Days", ylabel="Price", grid=True,
         title_prefix="Stock Prediction"):
    """
    Plots the actual and predicted stock prices.

    Parameters:
    actual: List or array of actual values.
    train: List or array of predicted values during training.
    test: List or array of predicted values during testing.
    accuracy: The prediction accuracy.
    figsize: A tuple specifying the size of the figure (default is (10, 6)).
    xlabel: Label of the x-axis (default is "Days").
    ylabel: Label of the y-axis (default is "Price").
    grid: Boolean indicating whether to display a grid (default is True).
    title_prefix: Prefix for the title of the plot (default is "Stock Prediction").
    """
    plt.figure(figsize=figsize)
    plt.plot(actual, label="Actual")
    plt.plot(train, label="Train prediction")
    test = [i for i in test]
    test.insert(0, train[-1])

    x_start = 0
    x_end = len(actual) - 1

    plt.plot(range(len(train) - 1, len(train) + len(test) - 1), test, label="Test prediction")
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)
    plt.title(f"{title_prefix} (Accuracy: {accuracy:.2f}%)")
    plt.legend()

    if grid:
        plt.grid()

    plt.xlim(x_start, x_end)
    plt.xticks(np.arange(x_start, x_end, 7), rotation=45)
    plt.subplots_adjust(bottom=0.20)

    plt.show()


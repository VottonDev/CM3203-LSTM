from typing import List, Tuple
import pandas as pd
import numpy as np

from algos.lstm_components.math import rmse, mse, mae, mape, r2


def load_json(file_path: str) -> pd.DataFrame:
    try:
        with open(file_path) as f:
            data = pd.read_json(f)
            return data[::-1]
    except FileNotFoundError:
        print(f"No file found at {file_path}")
        return pd.DataFrame()


def get_dataframe_from_json(file_path: str, stock: str, index_name: str) -> pd.DataFrame:
    data = load_json(file_path)
    dataframe = pd.DataFrame(data)
    dataframe = dataframe[dataframe['symbol'] == stock]
    dataframe = dataframe.set_index(index_name)
    return dataframe


def fetch_specific_stock(stock: str, live_data: bool) -> pd.DataFrame:
    file_path = 'realtime.json' if live_data else 'historical.json'
    index_name = 'latestTime' if live_data else 'priceDate'
    return get_dataframe_from_json(file_path, stock, index_name)


def transponse(data: pd.DataFrame) -> pd.DataFrame:
    return data.T


def make_numpy(data: List[List[float]]) -> np.ndarray:
    return np.array(data, dtype=float)


def normalise(data: np.array) -> np.array:
    return data / 1000


def denormalise(data: np.array) -> np.array:
    return data * 1000


def accuracy_percentage(prediction: np.ndarray, target: np.ndarray) -> float:
    return float((1 - abs(prediction[-1] - target[-1]) / target[-1]) * 100)


def process_slice(data: np.array, indices: list) -> tuple:
    input_1 = normalise(make_numpy([[data[i - 6], data[i - 5]] for i in indices if i >= 1]))
    input_2 = normalise(make_numpy([[data[i - 4], data[i - 3]] for i in indices if i >= 1]))
    input_3 = normalise(make_numpy([[data[i - 2], data[i - 1]] for i in indices if i >= 1]))
    target = normalise(make_numpy([[i] for i in data[1:len(indices)]]))

    return input_1, input_2, input_3, target


def process_data(data: np.ndarray, training_size: float) ->\
        Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    training_size = int(len(data) * training_size)
    train_indices = list(range(training_size))
    input_1, input_2, input_3, target = process_slice(data, train_indices)

    test_indices = list(range(training_size, len(data)))
    test_input_1, test_input_2, test_input_3, test_target = process_slice(data, test_indices)

    return input_1, input_2, input_3, target, test_input_1, test_input_2, test_input_3, test_target


def evaluate_metrics(prediction: np.ndarray, target: np.ndarray) -> None:
    print("RMSE: ", rmse(prediction, target))
    print("MSE: ", mse(prediction, target))
    print("MAE: ", mae(prediction, target))
    print("MAPE: ", mape(prediction, target))
    print("R2: ", r2(prediction, target))

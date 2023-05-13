import requests
from algos.lstm import LSTM
from components.datahandler import (
    fetch_specific_stock,
    process_data,
    denormalise,
    transponse,
    accuracy_percentage,
    evaluate_metrics
)
from components.plot import plot


class StockPredictor:

    def __init__(self, stock_symbol: str, epochs: int, training_percentage: float, plot_days: int, save_model: bool,
                 live_data: bool, send_data_to_api: bool):
        self.stock_symbol = stock_symbol
        self.epochs = epochs
        self.training_percentage = training_percentage
        self.plot_days = plot_days
        self.save_model = save_model
        self.live_data = live_data
        self.send_data_to_api = send_data_to_api

        self.target_key = "latestPrice" if self.live_data else "fclose"
        self.lstm = LSTM()

    def load_and_process_data(self):
        # Load and process the data
        self.data = fetch_specific_stock(self.stock_symbol, self.live_data)
        self.data = self.data[self.target_key]
        self.input_1, self.input_2, self.input_3, self.target, self.test_input_1, self.test_input_2, self.test_input_3, self.test_target = process_data(
            self.data, self.training_percentage
        )

    def train_model(self):
        # Train the LSTM model
        for i in range(self.epochs):
            for _ in self.input_1:
                self.train_prediction = self.lstm.train([self.input_1, self.input_2, self.input_3], self.target)
            if i % 100 == 0:
                print(f"Epoch: {i}")

    def denormalise_and_transpose(self):
        # Denormalize and transpose the data
        self.transposed_prediction = transponse(denormalise(self.train_prediction))
        self.target = denormalise(self.target)

    def evaluate_model(self):
        # Calculate and print the evaluation metrics
        evaluate_metrics(self.transposed_prediction, self.target)

    def test_model(self):
        # Test the model
        self.test_prediction = self.lstm.test([self.test_input_1, self.test_input_2, self.test_input_3])
        self.test_prediction = transponse(denormalise(self.test_prediction))

    def calculate_and_plot_accuracy(self):
        # Calculate and plot the prediction accuracy
        accuracy = accuracy_percentage(self.test_prediction, self.data)
        plot(
            self.data[-self.plot_days:],
            self.transposed_prediction[-self.plot_days:],
            self.test_prediction[:self.plot_days],
            accuracy,
        )

    def save_trained_model(self):
        if self.save_model:
            self.lstm.save("lstm_model.npz")

    def predict_future_data(self):
        # Predict future data
        self.future_prediction = self.lstm.predict_stock_values(
            [self.test_input_1, self.test_input_2, self.test_input_3], 3)
        self.future_prediction = denormalise(self.future_prediction)

    def send_prediction_to_api(self):
        if self.send_data_to_api:
            try:
                predicted_value = self.future_prediction[0].tolist()
                common_key = "your_common_key"
                type_of_prediction = "future"
                payload = {
                    "stock": self.stock_symbol,
                    "value": predicted_value,
                    "commonKey": common_key,
                    "type": type_of_prediction,
                }
                response = requests.post("http://localhost:3000/data/predictions", json=payload)
                response.raise_for_status()
            except requests.exceptions.RequestException as e:
                print(
                    "Failed to send data to the API. Please check if the destination URL is available and try again."
                )
                print(f"Error details: {e}")

    def run(self):
        self.load_and_process_data()
        self.train_model()
        self.denormalise_and_transpose()
        self.evaluate_model()
        self.test_model()
        self.calculate_and_plot_accuracy()
        self.save_trained_model()
        self.predict_future_data()
        self.send_prediction_to_api()

        print(f"Latest test prediction: {self.test_prediction[-1]}")
        print(f"Future predictions: {self.future_prediction}")


if __name__ == "__main__":
    stock_predictor = StockPredictor("AAPL", 1000, 0.8, 600, True, False, False)
    stock_predictor.run()

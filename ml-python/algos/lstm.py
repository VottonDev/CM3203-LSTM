import numpy as np
from .lstm_components.math import sigmoid
from .lstm_components.error import error
from .lstm_components.gates import forget_gate, input_gate, output_gate


class LSTM:
    def __init__(self, input_size: int = 2, lstm_cell_size: int = 2, output_size: int = 1, learning_rate: float = 0.4):
        # Initialise the LSTM network with the given parameters
        self.input_size = input_size  # Input size
        self.lstm_cell_size = lstm_cell_size  # LSTM cell size
        self.output_size = output_size  # Output size
        self.learning_rate = learning_rate  # Learning rate

        self.forget_weights, self.input_weights, self.output_weights, self.candidate_weights,\
            self.output_hidden_weights = self.initialise_weights()

        self.cell_state = np.ones((lstm_cell_size, 2), dtype=float)  # Initial cell state

        # Define the number of time steps to be used in the prediction
        self.num_time_steps = 5

    def initialise_weights(self):
        # Xavier's initialization for weights
        xavier_stddev: float = np.sqrt(2.0 / (self.input_size + self.lstm_cell_size))
        forget_weights = np.random.randn(self.input_size,
                                         self.lstm_cell_size).T * xavier_stddev  # Weight matrix for forget gate
        input_weights = np.random.randn(self.input_size,
                                        self.lstm_cell_size).T * xavier_stddev  # Weight matrix for input gate
        output_weights = np.random.randn(self.input_size,
                                         self.lstm_cell_size).T * xavier_stddev  # Weight matrix for output gate
        candidate_weights = np.random.randn(self.input_size,
                                            self.lstm_cell_size).T * xavier_stddev  # Weight matrix for candidate values
        output_hidden_weights = np.random.randn(self.lstm_cell_size,
                                                self.output_size).T * xavier_stddev  # Weight matrix for output layer

        return forget_weights, input_weights, output_weights, candidate_weights, output_hidden_weights

    # Function to run the specified gate
    def run_gate(self, gate_type, input_data, hidden_gate=1):
        if gate_type == 'forget':
            return forget_gate(input_data, self.forget_weights, self.cell_state, hidden_gate)
        elif gate_type == 'input':
            return input_gate(input_data, self.input_weights, self.candidate_weights, self.cell_state, hidden_gate)
        elif gate_type == 'output':
            return output_gate(input_data, self.output_weights, self.cell_state, hidden_gate)
        else:
            raise ValueError("Invalid gate type. Supported gate types: 'forget', 'input', and 'output'.")

    # Function to perform forward propagation
    def forward(self, inputs):
        # Set initial cell state for first cell
        self.cell_state = np.ones((self.lstm_cell_size, len(inputs[0][0])), dtype=float)
        self.cell_state = np.array(self.cell_state, ndmin=2)

        # Pass input through first LSTM cell
        self.run_gate('forget', inputs[0])
        self.run_gate('input', inputs[0])
        output_gate_output_1 = self.run_gate('output', inputs[0])

        # Pass input through second LSTM cell
        self.run_gate('forget', inputs[1], output_gate_output_1)
        self.run_gate('input', inputs[1], output_gate_output_1)
        output_gate_output_2 = self.run_gate('output', inputs[1], output_gate_output_1)

        # Pass input through third LSTM cell
        self.run_gate('forget', inputs[2], output_gate_output_2)
        self.run_gate('input', inputs[2], output_gate_output_2)
        output_gate_output_3 = self.run_gate('output', inputs[2], output_gate_output_2)

        # Dot product of final cell output and output weights
        final_input = np.dot(self.output_hidden_weights, output_gate_output_3)

        # Compute the neural network's output
        final_output = sigmoid(final_input)

        return final_output, output_gate_output_3

    # Function to compute the error between target and actual output
    def run_error(self, target, final_output):
        return error(self.output_hidden_weights.T, target, final_output)

    # Function to train the neural network
    def train(self, training_inputs, target):
        # Convert lists to 2D arrays
        training_inputs = [np.array(input_data, ndmin=2).T for input_data in training_inputs]
        target = np.array(target, ndmin=2).T

        # Forward propagation
        final_output, output_gate_output = self.forward(training_inputs)

        # Calculate output and cell output error
        output_error, cell_error = self.run_error(target, final_output)

        # Backpropagation
        self.backpropagation(training_inputs, output_gate_output, final_output, output_error, cell_error)

        return final_output

    # Function to perform backpropagation
    def backpropagation(self, training_inputs, output_gate_output, final_output, output_error, cell_error):
        # Compute common term for weight updates
        common_term = self.learning_rate * (cell_error * output_gate_output * (1.0 - output_gate_output))

        # Update the weights between cells and output
        self.output_hidden_weights += self.learning_rate * np.dot(
            (output_error * final_output * (1.0 - final_output)),
            output_gate_output.T
        )

        # Update the weights within LSTM cells
        self.forget_weights += np.dot(common_term, training_inputs[0].T)
        self.input_weights += np.dot(common_term, training_inputs[1].T)
        self.candidate_weights += np.dot(common_term, training_inputs[1].T)
        self.output_weights += np.dot(common_term, training_inputs[2].T)

    # Function to test the neural network
    def test(self, testing_inputs):
        # Convert lists to 2D arrays
        testing_inputs = [np.array(input_data, ndmin=2).T for input_data in testing_inputs]

        # Forward propagation
        final_output, output_gate_output = self.forward(testing_inputs)

        # Return final output
        return final_output

    # Function to save the neural network
    def save(self, file_name):
        # Save weights
        np.savez(file_name, forget_weights=self.forget_weights, input_weights=self.input_weights,
                 output_weights=self.output_weights, candidate_weights=self.candidate_weights,
                 output_hidden_weights=self.output_hidden_weights)

    # Function to load the neural network
    def load(self, file_name):
        # Load weights
        weights = np.load(file_name)
        self.forget_weights = weights['forget_weights']
        self.input_weights = weights['input_weights']
        self.output_weights = weights['output_weights']
        self.candidate_weights = weights['candidate_weights']

    # Function to predict future stock values
    def predict_stock_values(self, inputs, num_predictions):
        # Get the last "num_time_steps" values from the input data
        testing_inputs = [input_data[-self.num_time_steps:, :] for input_data in inputs]

        # Initialize an empty array to store the predicted stock values
        predicted_stock_values = np.zeros((num_predictions, 1))

        # Iterate through each time step and predict the next stock value
        for i in range(num_predictions):
            # Get the predicted value for the next time step
            final_output, _ = self.forward([input_data.T for input_data in testing_inputs])
            predicted_value = final_output.flatten()[0].item()

            # Update the predicted stock values array
            predicted_stock_values[i] = predicted_value

            # Update the input data for the next time step
            for j in range(len(testing_inputs)):
                testing_inputs[j] = np.roll(testing_inputs[j], -1, axis=0)
                testing_inputs[j][-1] = predicted_value

        return predicted_stock_values

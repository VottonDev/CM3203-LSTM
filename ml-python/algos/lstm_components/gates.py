import numpy as np
from algos.lstm_components.math import sigmoid, tanh


def compute_gate_input(input_data, weights, previous_hidden_state=1):
    # Compute the dot product of input data and weights
    dot_product = np.dot(weights, input_data)
    # Multiply by previous hidden state
    gate_input = previous_hidden_state * dot_product

    return gate_input


def forget_gate(input_data, forget_weights, cell_state, previous_hidden_state=1):
    forget_input = compute_gate_input(input_data, forget_weights, previous_hidden_state)
    # Apply the sigmoid activation function
    forget_gate_output = sigmoid(forget_input)
    # Update the current cell state
    cell_state = cell_state * forget_gate_output

    return cell_state


def input_gate(input_data, input_weights, candidate_weights, cell_state, previous_hidden_state=1):
    input_gate_input = compute_gate_input(input_data, input_weights, previous_hidden_state)
    candidate_gate_input = compute_gate_input(input_data, candidate_weights, previous_hidden_state)

    # Compute the input gate output
    input_gate_output = sigmoid(input_gate_input) * tanh(candidate_gate_input)

    # Update the current cell state
    cell_state = cell_state + input_gate_output

    return cell_state


def output_gate(input_data, output_weights, cell_state, previous_hidden_state=1):
    output_gate_input = compute_gate_input(input_data, output_weights, previous_hidden_state)

    # Apply the sigmoid activation function
    output_gate_output = sigmoid(output_gate_input)

    # Compute the hidden state output
    hidden_state_output = tanh(cell_state) * output_gate_output

    return hidden_state_output

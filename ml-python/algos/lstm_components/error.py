import numpy as np


def error(output_weights, target, final_output):
    # Compute the error of the output layer as the difference between the target output and the final output
    output_error = target - final_output

    # Compute the error of the hidden layer as the dot product of the output weights and the output error
    hidden_error = np.dot(output_weights, output_error)

    return output_error, hidden_error

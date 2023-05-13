import numpy as np

# Make LSTM compatible with GPU, doesn't support Python 3.11 as of now
try:
    from numba import cuda

    cuda.detect()  # Check if CUDA is available
    import cupy as cp

    print('Using Cupy')
except:
    print('Using NumPy')
    cp = np  # Use NumPy as a fallback


def use_gpu(func):
    def wrapper(*args, **kwargs):
        if cp == np:
            return func(*args, **kwargs)
        else:
            # Convert all input arguments to Cupy arrays
            args = [cp.asarray(arg) for arg in args]
            kwargs = {k: cp.asarray(v) for k, v in kwargs.items()}
            # Call the function with the Cupy arrays
            result = func(*args, **kwargs)
            # Convert the result back to a NumPy array
            return np.asarray(result)

    return wrapper

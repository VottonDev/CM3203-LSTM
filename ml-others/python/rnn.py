import json
import numpy as np
from keras.utils import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, SimpleRNN, Dropout
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split

# Load the JSON file
with open("historical.json") as f:
    data = json.load(f)

# Extract the closing price
closing_price = []
for record in data:
    closing_price.append(record["fclose"])

# Convert to numpy array and reshape
closing_price = np.array(closing_price).reshape(-1, 1)

scaler = MinMaxScaler()
df = scaler.fit_transform(closing_price)

window_size = 30
X = []
y = []
for i in range(window_size, len(df)):
    X.append(df[i-window_size:i, 0])
    y.append(df[i, 0])
X, y = np.array(X), np.array(y)

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

X_train = pad_sequences(X_train, maxlen=window_size, dtype='float32')
X_test = pad_sequences(X_test, maxlen=window_size, dtype='float32')

model = Sequential()
model.add(SimpleRNN(50, input_shape=(window_size, 1), activation='relu'))
model.add(Dropout(0.2))
model.add(Dense(1))

model.compile(optimizer='adam', loss='mean_squared_error')

history = model.fit(X_train, y_train, epochs=1000, batch_size=32, validation_data=(X_test, y_test))

# Make predictions on the test set
inputs = df[len(df)-window_size:]
X_test = pad_sequences([inputs], maxlen=window_size, dtype='float32')
predicted_stock_price_scaled = model.predict(X_test)
predicted_stock_price = scaler.inverse_transform(predicted_stock_price_scaled)

print(predicted_stock_price)

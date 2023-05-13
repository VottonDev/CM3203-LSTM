import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from tensorflow.keras.layers import Dense, LSTM, Dropout
from tensorflow.keras.models import Sequential

# Load the JSON file
with open("historical.json") as f:
    data = pd.read_json(f)

# Create a Pandas dataframe from the JSON data
df = pd.DataFrame(data)

# Get the closing price
closing_price = df['fclose'].values

# Perform the necessary data preprocessing
sc = MinMaxScaler(feature_range=(0, 1))
closing_price_scaled = sc.fit_transform(closing_price.reshape(-1, 1))

X_train = []
y_train = []
for i in range(60, len(closing_price_scaled)):
    X_train.append(closing_price_scaled[i-60:i, 0])
    y_train.append(closing_price_scaled[i, 0])

X_train, y_train = np.array(X_train), np.array(y_train)
X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))

# Split data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X_train, y_train, test_size=0.2)

# Build the LSTM model
model = Sequential()
model.add(LSTM(units=50, return_sequences=True, input_shape=(X_train.shape[1], 1)))
model.add(Dropout(0.2))
model.add(LSTM(units=50, return_sequences=True))
model.add(Dropout(0.2))
model.add(LSTM(units=50, return_sequences=True))
model.add(Dropout(0.2))
model.add(LSTM(units=50))
model.add(Dropout(0.2))
model.add(Dense(units=1))

model.compile(optimizer='adam', loss='mean_squared_error')

# Train the model
model.fit(X_train, y_train, epochs=1000, batch_size=32)

# Make predictions on the test set
predicted_stock_price_scaled = model.predict(X_test)
predicted_stock_price = sc.inverse_transform(predicted_stock_price_scaled)

print(predicted_stock_price)

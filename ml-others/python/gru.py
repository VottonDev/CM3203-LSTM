import json
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.layers import Dense, GRU, Dropout
from tensorflow.keras.models import Sequential

# Load the JSON file
with open("historical.json") as f:
    data = json.load(f)

# Extract the closing price
closing_price = []
for record in data:
    closing_price.append(record["fclose"])

# Convert to numpy array and reshape
closing_price = np.array(closing_price).reshape(-1, 1)

# Perform the necessary data preprocessing
sc = MinMaxScaler(feature_range=(0, 1))
closing_price_scaled = sc.fit_transform(closing_price)

X = []
y = []
for i in range(60, len(closing_price_scaled)):
    X.append(closing_price_scaled[i-60:i, 0])
    y.append(closing_price_scaled[i, 0])

X, y = np.array(X), np.array(y)
X = np.reshape(X, (X.shape[0], X.shape[1], 1))

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

# Build the GRU model
model = Sequential()
model.add(GRU(units=50, return_sequences=True, input_shape=(X_train.shape[1], 1)))
model.add(Dropout(0.2))
model.add(GRU(units=50, return_sequences=True))
model.add(Dropout(0.2))
model.add(GRU(units=50))
model.add(Dropout(0.2))
model.add(Dense(units=1))

model.compile(optimizer='adam', loss='mean_squared_error')

# Train the model
model.fit(X_train, y_train, epochs=1000, batch_size=32)

# Make predictions on the test set
predicted_stock_price_scaled = model.predict(X_test)
predicted_stock_price = sc.inverse_transform(predicted_stock_price_scaled)

print(predicted_stock_price)

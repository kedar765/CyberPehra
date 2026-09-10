import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib


# 1. Load dataset
data = pd.read_csv("ml/dataset.csv", sep=",")

print("Dataset loaded successfully!")
print(data.head())


# 2. Select features
X = data[
    [
        "transaction_amount",
        "transaction_hour",
        "transaction_frequency",
        "previous_fraud_count"
    ]
]

# Target
y = data["risk"]


# 3. Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# 4. Create Random Forest model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)


# 5. Train model
model.fit(X_train, y_train)

print("Model trained successfully!")


# 6. Make predictions
predictions = model.predict(X_test)


# 7. Calculate accuracy
accuracy = accuracy_score(y_test, predictions)

print(f"Model Accuracy: {accuracy * 100:.2f}%")


# 8. Save model
joblib.dump(model, "ml/cybercrime_model.pkl")

print("Model saved successfully!")
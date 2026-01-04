import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

def predict_price(df: pd.DataFrame):
    """
    Simple prediction pipeline.
    Uses Linear Regression (closest simple approx to trend) 
    to predict next 7 days.
    """
    # Prepare data for simple ML
    df['Numbers'] = list(range(0, len(df)))
    
    X = df[['Numbers']]
    y = df['Close']
    
    # Train
    model = LinearRegression()
    model.fit(X, y)
    
    # Predict next 7 days
    last_idx = df['Numbers'].iloc[-1]
    next_days = [[last_idx + i] for i in range(1, 8)]
    predictions = model.predict(next_days)
    
    # Calc simple signal
    current_price = df['Close'].iloc[-1]
    future_price = predictions[-1]
    
    signal = "HOLD"
    if future_price > current_price * 1.02:
        signal = "BUY"
    elif future_price < current_price * 0.98:
        signal = "SELL"
        
    return {
        "days": 7,
        "predicted_prices": predictions.tolist(),
        "target_price": round(future_price, 2),
        "signal": signal,
        "model_used": "LinearRegression (Proxy for ARIMA)"
    }

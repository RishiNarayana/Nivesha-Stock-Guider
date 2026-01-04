from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.stock_data import get_stock_data
from services.ml_models import predict_price
import uvicorn
import os

app = FastAPI(title="Nivesha ML Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ML Engine Running", "version": "1.0.0"}

@app.get("/predict/{symbol}")
def get_prediction(symbol: str):
    try:
        # 1. Fetch Data
        df = get_stock_data(symbol)
        
        if df is None or df.empty:
            raise HTTPException(status_code=404, detail="Stock data not found")

        # 2. Run Prediction
        prediction = predict_price(df)
        
        return {
            "symbol": symbol,
            "current_price": float(df['Close'].iloc[-1]),
            "prediction": prediction
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

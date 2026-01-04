# 🚀 How to Run Nivesha.ai Locally

## 1. Database Setup
Ensure **MongoDB** is running locally on port `27017`.
- Default Database: `nivesha`

## 2. Start ML Engine (Python)
```bash
cd backend-python-ml
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*Health Check:* http://localhost:8000/

## 3. Start AI Gateway (Node.js)
```bash
cd backend-node-ai
npm install
node index.js
```
*Port:* 5000

## 4. Start Core Backend (Spring Boot)
```bash
cd backend-springboot
./mvnw spring-boot:run
```
*Port:* 8080

## 5. Start Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
*URL:* http://localhost:5173/

---

## 🧪 Testing with Postman

### Login
- **URL**: `POST http://localhost:8080/api/auth/signin`
- **Body**: `{ "username": "admin", "password": "password123" }`

### Get Stock Analysis
- **URL**: `GET http://localhost:5000/api/ai/analyze/AAPL`

### Get Prediction
- **URL**: `GET http://localhost:8000/predict/AAPL`

Write-Host "🚀 Starting Nivesha.ai Ecosystem..." -ForegroundColor Cyan

# 1. Start Python ML Engine
Write-Host "1. Launching Python ML Engine..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend-python-ml; echo 'Installing Deps...'; pip install -r requirements.txt; echo 'Starting FastAPI...'; uvicorn main:app --reload --port 8000"

# 2. Start Node.js AI Gateway
Write-Host "2. Launching AI Gateway..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend-node-ai; echo 'Installing Deps...'; npm install; echo 'Starting Express...'; node index.js"

# 3. Start Spring Boot Backend
Write-Host "3. Launching Spring Boot Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend-springboot; echo 'Building & Starting Spring Boot...'; ./mvnw spring-boot:run"

# 4. Start Frontend
Write-Host "4. Launching Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; echo 'Starting Vite...'; npm install; npm run dev"

Write-Host "✅ All services launched in new windows!" -ForegroundColor Green
Write-Host "Backend API: http://localhost:8080"
Write-Host "AI Gateway:  http://localhost:5000"
Write-Host "ML Engine:   http://localhost:8000"
Write-Host "Frontend:    http://localhost:5173"

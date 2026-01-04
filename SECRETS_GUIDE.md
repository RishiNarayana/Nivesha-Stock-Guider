# 🔑 Nivesha.ai API Keys & Secrets Setup

To run Nivesha.ai fully, you need to configure a few API keys. Here is exactly what you need and where to put them.

## 1. Gemini API Key (For AI Advisor)
**Service:** Node.js AI Gateway (`backend-node-ai`)
- **Required For:** The "AI Advisor" chat and stock analysis summaries.
- **Where to get it:** [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Make sure:** You have a valid Google Cloud project or use the free tier if available in your region.

**Action:**
1.  Navigate to `backend-node-ai/`.
2.  Rename `.env.example` to `.env`.
3.  Paste your key:
    ```ini
    GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxx
    ```

## 2. Alpha Vantage API Key (For Market Data)
**Service:** Python ML Engine (`backend-python-ml`)
- **Required For:** Fetching stock price history if `yfinance` fails (Fallback mechanism).
- **Where to get it:** [Alpha Vantage](https://www.alphavantage.co/support/#api-key) (Free Tier available).

**Action:**
1.  Navigate to `backend-python-ml/`.
2.  Rename `.env.example` to `.env`.
3.  Paste your key:
    ```ini
    ALPHA_VANTAGE_KEY=YOUR_ALPHA_NANTAGE_KEY
    ```

## 3. JWT Secret (For Security)
**Service:** Spring Boot Backend (`backend-springboot`)
- **Required For:** Encrypting user login tokens (JWTs) so they are secure.
- **Where to get it:** You can generate a random string.
    - *Example (Mac/Linux):* `openssl rand -base64 32`
    - *Or just use a long random string like:* `MySuperSecretRandomKeyForNivesha2025!`

**Action:**
1.  Open `backend-springboot/src/main/resources/application.properties`.
2.  Update the secret (if you want to change the default):
    ```properties
    nivesha.app.jwtSecret=YOUR_NEW_SECURE_SECRET_KEY_HERE
    ```

## 4. Frontend Config
**Service:** Frontend (`frontend`)
- **Required For:** Connecting the React UI to the Backend APIs.

**Action:**
1.  Navigate to `frontend/`.
2.  Rename `.env.example` to `.env` (or `.env.local`).
3.  Ensure the URLs match your running services:
    ```ini
    VITE_API_URL=http://localhost:8080/api
    VITE_AI_GATEWAY_URL=http://localhost:5000/api/ai
    ```

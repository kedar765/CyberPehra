# CyberPehra Backend (FastAPI)

Beginner-friendly backend for **CyberPehra – AI-Powered Predictive Analytics Framework for Cybercrime Complaints**.

This folder is a **separate backend**. The Next.js UI lives in `../frontend` and was not changed.

---

## 1. Project overview

CyberPehra helps police, banks, and I4C staff:

1. Receive a cybercrime complaint  
2. Store it in PostgreSQL  
3. Look at related money transactions  
4. Run a machine-learning (or demo) risk model  
5. Turn that into a **0–100 risk score**  
6. Mark risky cities as **hotspots** for a map  
7. Create **alerts** when the score is CRITICAL  
8. Show totals on a **dashboard API**

This is an SIH **prototype**. It is structured so you can later plug in a real trained `model.pkl`.

---

## 2. Features

- JWT login with roles: `ADMIN`, `POLICE`, `BANK`, `I4C`
- Complaint and transaction CRUD-style APIs
- ML prediction with automatic **fallback** if `model.pkl` is missing
- Risk engine with editable weights
- Hotspot list for Leaflet / React maps
- Critical alerts (`NEW` / `ACKNOWLEDGED` / `RESOLVED`)
- Dashboard stats
- Swagger docs at `/docs`

---

## 3. Technology stack

| Layer | Tool |
| --- | --- |
| API | Python, FastAPI, Uvicorn |
| Database | PostgreSQL + SQLAlchemy |
| Validation | Pydantic |
| Auth | JWT (`python-jose`) + bcrypt (`passlib`) |
| ML | pandas, NumPy, scikit-learn, joblib |

---

## 4. Folder structure (what each part does)

```
backend/
├── app/
│   ├── main.py                 # Starts FastAPI, CORS, routers, / and /health
│   ├── core/
│   │   ├── config.py           # Reads .env (DATABASE_URL, SECRET_KEY, ...)
│   │   └── security.py         # Password hashing + JWT + current user
│   ├── database/
│   │   ├── database.py         # Engine + get_db() session
│   │   └── models.py           # Tables: users, complaints, transactions, ...
│   ├── routers/                # HTTP endpoints (what the frontend calls)
│   ├── schemas/                # Request/response shapes (Pydantic)
│   ├── services/               # ML, risk, hotspot, alert logic
│   └── utils/helpers.py        # Small shared functions
├── ml_models/
│   ├── model.pkl               # Optional trained model (created later)
│   └── create_demo_model.py    # Optional script to generate a tiny .pkl
├── requirements.txt
├── .env.example
└── README.md
```

---

## 5. How the three main pieces connect

### Frontend (Next.js) → Backend (FastAPI)

The UI should call `http://127.0.0.1:8000/...` (CORS already allows `http://localhost:3000`).

Typical login flow:

1. `POST /auth/login` with `{ "email", "password" }`
2. Save `access_token`
3. On every later request send header:  
   `Authorization: Bearer <access_token>`

Example:

```javascript
const res = await fetch("http://127.0.0.1:8000/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "admin@cyberpehra.local", password: "yourpassword" }),
});
const data = await res.json();
// data.access_token
```

### FastAPI → PostgreSQL

`get_db()` opens a SQLAlchemy session for one request. Routers use it to `query`, `add`, and `commit` rows. Connection string comes from `DATABASE_URL` in `.env`.

### FastAPI → ML model

`POST /predictions/predict` calls `MLPredictionService`:

1. Build numeric features from the complaint + transactions  
2. If `ml_models/model.pkl` loads, use `predict_proba`  
3. If not, use the **demo formula** (backend still runs)  
4. `calculate_risk_score()` mixes ML (40%) with amount, location, pattern, and time  

---

## 6. Installation steps (Windows PowerShell)

Do these from the **backend** folder.

### 6.1 Go to the backend folder

```powershell
cd E:\SIH2026\CyberPehra---clone\backend
```

### 6.2 Create a virtual environment

A virtual environment is a private Python folder so packages do not mix with the rest of your PC.

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

If Windows blocks scripts, run this once in PowerShell as Administrator, then try Activate again:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Your prompt should start with `(venv)`.

### 6.3 Install dependencies

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

---

## 7. PostgreSQL setup

1. Install PostgreSQL and start the service.
2. Open **pgAdmin** or `psql`.
3. Create a database named `cyberpehra_db`:

```sql
CREATE DATABASE cyberpehra_db;
```

4. Remember your PostgreSQL username and password (often `postgres`).

On first API start, FastAPI **creates tables automatically**. You do not need to write `CREATE TABLE` by hand for this prototype.

---

## 8. Environment variables

```powershell
copy .env.example .env
```

Edit `backend/.env` (use your real DB user, but never commit this file):

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/cyberpehra_db
SECRET_KEY=any-long-random-string-for-the-demo
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

`SECRET_KEY` signs JWT tokens. `DATABASE_URL` is how FastAPI finds PostgreSQL.

You can keep the URL as `postgresql://...`. The backend automatically uses the modern `psycopg` driver (needed on Python 3.14).

---

## 9. How to run the backend

Always run from the `backend` folder with the venv activated:

```powershell
cd E:\SIH2026\CyberPehra---clone\backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

Then open:

- API root: http://127.0.0.1:8000  
- Health: http://127.0.0.1:8000/health  
- Swagger (try APIs in the browser): http://127.0.0.1:8000/docs  
- ReDoc: http://127.0.0.1:8000/redoc  

---

## 10. First API calls (order matters)

1. **Register** `POST /auth/register`

```json
{
  "name": "Admin User",
  "email": "admin@cyberpehra.local",
  "password": "password123",
  "role": "ADMIN"
}
```

Roles must be one of: `ADMIN`, `POLICE`, `BANK`, `I4C`.

2. **Login** `POST /auth/login` → copy `access_token`.
3. In Swagger click **Authorize** and paste the token (or send the Bearer header).
4. **Create complaint** `POST /complaints`
5. Optional: **Create transaction** `POST /transactions` (include `complaint_id`)
6. **Predict** `POST /predictions/predict` with `{ "complaint_id": 1 }`
7. Open `/dashboard/stats`, `/hotspots`, `/alerts`

---

## 11. API endpoint list

| Method | Path | Auth | What it does |
| --- | --- | --- | --- |
| GET | `/` | No | API is running |
| GET | `/health` | No | Health check |
| POST | `/auth/register` | No | Create user |
| POST | `/auth/login` | No | Get JWT |
| GET | `/auth/me` | Yes | Current user |
| POST | `/complaints` | Yes | Create complaint |
| GET | `/complaints` | Yes | List complaints |
| GET | `/complaints/{id}` | Yes | One complaint |
| PUT | `/complaints/{id}` | Yes | Update complaint |
| DELETE | `/complaints/{id}` | ADMIN or I4C | Delete complaint |
| POST | `/transactions` | Yes | Add transaction |
| GET | `/transactions` | Yes | List transactions |
| GET | `/transactions/{id}` | Yes | One transaction |
| GET | `/transactions/complaint/{complaint_id}` | Yes | Transactions for a complaint |
| POST | `/predictions/predict` | Yes | Run ML + risk score |
| GET | `/predictions` | Yes | List predictions |
| GET | `/predictions/{id}` | Yes | One prediction |
| GET | `/hotspots` | Yes | All map zones |
| GET | `/hotspots/high-risk` | Yes | HIGH + CRITICAL zones |
| GET | `/alerts` | Yes | All alerts |
| GET | `/alerts/high-risk` | Yes | High/critical alerts |
| PUT | `/alerts/{id}/status` | Yes | NEW / ACKNOWLEDGED / RESOLVED |
| GET | `/dashboard/stats` | Yes | Totals for the UI |
| GET | `/dashboard/recent-alerts` | Yes | Latest 10 alerts |
| GET | `/dashboard/risk-distribution` | Yes | Counts by risk level |

---

## 12. Risk score (easy to change later)

File: `app/services/risk_service.py`

| Input | Weight |
| --- | --- |
| ML prediction | 40% |
| Fraud amount | 20% |
| Location risk | 20% |
| Transaction pattern | 10% |
| Time risk | 10% |

| Score | Level |
| --- | --- |
| 0–30 | LOW |
| 31–60 | MEDIUM |
| 61–80 | HIGH |
| 81–100 | CRITICAL |

If `risk_score >= 81`, an alert is created automatically.

---

## 13. Optional: create `model.pkl`

The API works without this. To generate a tiny demo sklearn model:

```powershell
python -m ml_models.create_demo_model
```

Later, replace `ml_models/model.pkl` with your real trained model. Keep the same 10-feature order used in `MLPredictionService._features_to_vector`.

---

## 14. Common errors

| Problem | What to do |
| --- | --- |
| `password authentication failed` | Fix username/password in `DATABASE_URL` |
| `database "cyberpehra_db" does not exist` | Run `CREATE DATABASE cyberpehra_db;` |
| `Could not import module app.main` | You are not inside the `backend` folder |
| `401 Invalid credentials` | Login again; put `Bearer` token on the request |
| Packages fail on Python 3.14 | Install Python 3.11 or 3.12 and recreate `venv` |

---

## 15. Security note

This is a **hackathon prototype**. Before any real deployment: change `SECRET_KEY`, use HTTPS, restrict CORS, and add proper migrations (Alembic) instead of `create_all` on startup.

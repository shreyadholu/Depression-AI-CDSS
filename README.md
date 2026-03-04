# AI-CDSS Depression Detection System

A full-stack AI-powered Clinical Decision Support System (CDSS) for Depression Detection using Python backend and React frontend.

![AI-CDSS](https://img.shields.io/badge/AI-CDSS-Depression%20Detection-brightgreen)
![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-blue)
![React](https://img.shields.io/badge/React-18.2-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🧠 System Overview

```
AI-CDSS-PYTHON → Interactive Input Forms → AI Model → Disease Diagnosis Output → Risk Insights → Recommendations
```

This system uses:
- **Machine Learning**: Logistic Regression, KMeans Clustering, Isolation Forest
- **Backend**: FastAPI with Python
- **Frontend**: React + Vite + TailwindCSS + Framer Motion

## 📁 Project Structure

```
ai-cdss/
├── main.py                    # FastAPI application
├── requirements.txt           # Python dependencies
├── create_models.py          # Script to create ML models
├── schemas/
│   └── patient_schema.py     # Pydantic schemas
├── services/
│   ├── preprocessing.py      # Data preprocessing
│   ├── prediction.py          # ML prediction
│   └── risk_analysis.py       # Risk level analysis
├── utils/
│   └── recommendations.py     # AI recommendations
├── model/                     # Trained models
│   ├── model.pkl
│   ├── scaler.pkl
│   ├── kmeans.pkl
│   └── iso_forest.pkl
└── frontend/                  # React frontend
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        │   └── Navbar.jsx
        └── pages/
            ├── Landing.jsx
            ├── Assessment.jsx
            ├── Results.jsx
            ├── Login.jsx
            └── AdminDashboard.jsx
```

## 🚀 Features

### Backend Features
- ✅ FastAPI with automatic API documentation (Swagger)
- ✅ JWT Authentication
- ✅ Machine Learning models (Logistic Regression, KMeans, Isolation Forest)
- ✅ Patient data preprocessing
- ✅ Depression probability prediction
- ✅ Risk level analysis (Low/Moderate/High)
- ✅ Cluster categorization
- ✅ Outlier detection
- ✅ AI-generated personalized recommendations
- ✅ Prediction history storage
- ✅ Analytics endpoint

### Frontend Features
- ✅ Modern landing page with animations
- ✅ Multi-step assessment form wizard
- ✅ Progress bar with step indicators
- ✅ Interactive sliders and form controls
- ✅ Real-time form validation
- ✅ Animated results dashboard
- ✅ Circular progress indicator
- ✅ Risk level color coding
- ✅ PDF report generation
- ✅ Local storage for saving records
- ✅ Admin dashboard with charts
- ✅ Dark/Light mode toggle
- ✅ Responsive design

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the project directory:
```bash
cd c:/project
```

2. Create a virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Create the ML models (if not already created):
```bash
python create_models.py
```

5. Start the FastAPI server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install npm dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at: http://localhost:5173

### Production Build

For frontend:
```bash
cd frontend
npm run build
```

The build output will be in the `dist` folder.

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/token` | Get JWT token |
| POST | `/api/predict` | Make prediction |
| GET | `/api/history` | Get prediction history (protected) |
| GET | `/api/analytics` | Get analytics data (protected) |
| DELETE | `/api/history/{id}` | Delete a record (protected) |

## 🔐 Authentication

Demo credentials:
- **Username**: `admin`
- **Password**: `admin123`

## 🎨 UI Preview

### Landing Page
- Animated gradient background
- Feature cards with icons
- Call-to-action buttons

### Assessment Form
- 4-step wizard (Demographics → Lifestyle → Stress → Mental Health)
- Progress bar
- Smart sliders
- Tooltips for guidance
- Form validation

### Results Dashboard
- Circular progress indicator
- Risk level badges
- Diagnosis result
- Personalized recommendations
- PDF download
- Save to local storage

### Admin Dashboard
- Statistics cards
- Risk distribution chart (Doughnut)
- Trend line chart
- Monthly risk breakdown (Bar chart)
- Prediction history table
- Record detail modal

## 🧠 AI Logic

### Risk Level Determination
- **Low Risk**: Probability < 30%
- **Moderate Risk**: Probability 30-60%
- **High Risk**: Probability > 60%

### Recommendations
- **Low Risk**: Maintain healthy habits, regular monitoring
- **Moderate Risk**: Consider counseling, stress management
- **High Risk**: Immediate professional consultation

### Outlier Detection
The system uses Isolation Forest to detect unusual behavioral patterns.

## 🔧 Configuration

### Environment Variables (Backend)
```python
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
```

### CORS Configuration
Update `main.py` to configure allowed origins:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📝 License

MIT License - see LICENSE file for details.

## ⚠️ Disclaimer

This system is for **screening purposes only** and is **not a medical diagnosis**. 
Please consult a healthcare professional for proper evaluation and treatment.

---

Built with ❤️ using FastAPI + React + Machine Learning


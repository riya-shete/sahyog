

```markdown
# Sahyog Records 🏥

AI-powered platform for unified patient records, prescription tracking, and predictive diagnostics.

![Demo](https://img.shields.io/badge/Demo-Live-green) 
![Tech](https://img.shields.io/badge/Stack-Next.js%2BFirebase%2BFastAPI-blue)

## ✨ Features
- **Patient Portal**: View prescriptions, upload medical reports
- **Doctor Dashboard**: Access complete patient history
- **AI Diagnostics**: Analyze CBC/HbA1c reports for risks (anemia, diabetes)
- **Secure**: Firebase authentication + encrypted records

## 🛠️ Tech Stack
- **Frontend**: Next.js, Tailwind CSS, Shadcn UI
- **Backend**: Firebase (Auth/Firestore), FastAPI
- **AI**: Scikit-learn (demo model)
- **Hosting**: Vercel (Frontend), Modal (Backend)

## 🚀 Quick Start

### Prerequisites
- Node.js ≥18, Python ≥3.10
- Firebase account (for auth/db)
- Modal account (for AI API)

### Installation
1. **Clone repo**
   ```bash
   git clone https://github.com/riya-shete/sahyog.git
   cd sahyog
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local  # Add Firebase config
   ```

3. **Backend Setup**
   ```bash
   cd ../backend
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   pip install -r requirements.txt
   ```

4. **Run Locally**
   - Frontend:
     ```bash
     cd ../frontend
     npm run dev
     ```
   - Backend (AI):
     ```bash
     cd ../backend
     uvicorn main:app --reload
     ```

5. **Deploy**
   - Frontend: `vercel deploy`
   - Backend: `modal deploy main.py`

## 📂 Project Structure
```
sahyog/
├── frontend/     # Next.js app
├── backend/      # FastAPI server
├── ai/           # ML model training
└── README.md
```

## 🌟 Contributors
- [Anand Sharma](https://github.com/AnandS1807)
- [Riya Shete](https://github.com/riya-shete)

## 📄 License
MIT
```

---

### Key Sections Optimized:
1. **Badges**: Quick visibility of project status  
2. **Prerequisites**: Explicitly lists requirements  
3. **Commands**: Copy-paste friendly setup  
4. **Structure**: Clear directory overview  

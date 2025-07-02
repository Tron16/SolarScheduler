# Solar Scheduler

*Predict solar panel installation times for solar companies using data-driven machine learning.*

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Features](#features)  
- [Technology Stack](#technology-stack)  
- [Installation & Setup](#installation--setup)  
- [Usage](#usage)  
- [Project Structure](#project-structure)  
- [Future Improvements](#future-improvements)  

---

## Project Overview

Solar Scheduler analyzes historical installation data and runs machine learning models to predict how long a new solar panel installation will take—helping operations teams schedule jobs more accurately and efficiently.

---

## Features

- **Data-Driven Estimates**  
  Predict installation duration based on 20+ variables (site size, panel type, crew size, weather conditions, travel time, etc.).

- **Interactive Input Form**  
  Users enter project details in a React-based form and receive an instant time estimate.

- **Secure Authentication**  
  Firebase Authentication ensures only authorized users can access the scheduling interface.

- **API-Powered Predictions**  
  A Django backend serves as the prediction API (internal implementation omitted for confidentiality).

---

## Technology Stack

- **Frontend**  
  - React  
  - Tailwind CSS  
  - Axios (for HTTP requests)

- **Backend & ML**  
  - Django REST Framework (prediction API)  
  - Python ML stack: Pandas, scikit-learn, NumPy  
  - (Details of model hosting and endpoints are internal)

- **Authentication**  
  - Firebase Authentication (email/password, OAuth providers)

---

## Installation & Setup

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-org/solar-scheduler.git
   cd solar-scheduler
   ```

2. **Frontend setup**  
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend setup**  
   > *Internal details omitted for confidentiality.*  
   Ensure your `.env` or secrets vault contains Django settings and ML model credentials.

4. **Firebase configuration**  
   - Create a Firebase project  
   - Enable Email/Password and/or OAuth providers  
   - Download and place `firebaseConfig.js` (or `.env` vars) into the frontend config directory

---

## Usage

1. **Start the frontend** (`npm run dev`) and navigate to `http://localhost:3000`.  
2. **Log in** with a Firebase-authenticated account.  
3. **Fill in** project variables (site size, panel count, weather, etc.) in the input form.  
4. **Submit** to receive a predicted installation time.  
5. **Review** and export the estimate for scheduling purposes.

---

## Project Structure

```
solar-scheduler/
├── frontend/              # React application
│   ├── public/
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Custom React hooks
│   │   └── firebaseConfig.js
│   ├── package.json
│   └── tailwind.config.js
├── backend/               # Django REST API & ML model code
│   ├── scheduler/         # Django app modules
│   ├── models.py          # ML model wrappers
│   └── requirements.txt
└── README.md
```

---

## Future Improvements

- **Model Refinement**: Experiment with additional algorithms (e.g., gradient boosting, neural nets) to improve accuracy.  
- **Realtime Retraining**: Automate retraining pipelines as new installation data is collected.  
- **Visualization Dashboard**: Add charts showing prediction errors over time and feature importance.  
- **Mobile Interface**: Build a React Native companion app for field technicians.  

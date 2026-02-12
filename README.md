# Snap Service - Project Instructions

This project consists of a **Spring Boot Backend** and a **React Frontend**. Follow the steps below to run both components manually.

---

## 🚀 Running the Project

You will need to open **two separate terminal windows**.

### 1. Start the Backend (Spring Boot)
1. Open a terminal and navigate to the `backend` folder:
   ```powershell
   cd backend
   ```
2. Run the application using the Maven wrapper:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
   *The backend will start on `http://localhost:8080`.*

### 2. Start the Frontend (React)
1. Open a **second terminal** and navigate to the `frontend` folder:
   ```powershell
   cd frontend
   ```
2. Install dependencies (only required the first time):
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   npm start
   ```
   *The frontend will open in your browser at `http://localhost:3000`.*

---

## 🛠️ Summary table

| Component | Directory | Command | URL |
| :--- | :--- | :--- | :--- |
| **Backend (Spring Boot)** | `backend` | `mvn spring-boot:run` | `http://localhost:8080` |
| **Payment Service (ASP.NET Core)** | `payment-dotnet` | `dotnet run` | `http://localhost:5000` |
| **Frontend (React)** | `frontend` | `npm start` | `http://localhost:3000` |

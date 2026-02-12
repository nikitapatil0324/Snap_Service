# SnapService – Full Stack Service Booking Platform

SnapService is a full-stack service booking application that supports user bookings and service provider management through secure, role-based access.

The project is built using:

- Spring Boot (Main Backend – Booking & Authentication)
- ASP.NET Core (Payment Gateway Service)
- React.js (Frontend UI)
- MySQL (Database)

---

# Project Structure

```
snapservice/
│
├── backend/           # Spring Boot Application
├── payment-dotnet/    # ASP.NET Core Payment Service
├── frontend/          # React Application
└── README.md
```

---

#  Prerequisites

Make sure the following are installed:

- Java 17+
- Maven
- .NET 6 or later
- Node.js (v16+ recommended)
- MySQL

---

# Running the Project

You will need to open **three separate terminal windows**.

---

## 1️. Start the Backend (Spring Boot)

1. Open a terminal and navigate to the `backend` folder:

```bash
cd backend
```

2. Run the application:

```bash
mvn spring-boot:run
```

The backend will start at:  
http://localhost:8080

---

## 2️. Start the Payment Service (ASP.NET Core)

1. Open another terminal and navigate to the `payment-dotnet` folder:

```bash
cd payment-dotnet
```

2. Run the application:

```bash
dotnet run
```

The payment service will start at:  
http://localhost:5000

---

## 3️. Start the Frontend (React)

1. Open a third terminal and navigate to the `frontend` folder:

```bash
cd frontend
```

2. Install dependencies (only required the first time):

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The frontend will open at:  
http://localhost:3000

---

#  Summary Table

| Component | Directory | Command | URL |
|------------|------------|------------|------------|
| Backend (Spring Boot) | backend | mvn spring-boot:run | http://localhost:8080 |
| Payment Service (ASP.NET Core) | payment-dotnet | dotnet run | http://localhost:5000 |
| Frontend (React) | frontend | npm start | http://localhost:3000 |

---

#  Key Features

- JWT Authentication
- Role-based Authorization (User/Admin)
- Service Booking System
- Razorpay Payment Integration
- Booking History & Cancellation
- Review & Rating System
- Admin Dashboard
- Secure REST APIs

---

#  Architecture Overview

- React frontend communicates with Spring Boot backend.
- Spring Boot handles authentication, booking, and business logic.
- Payment requests are forwarded to ASP.NET Core service.
- MySQL is used for relational data storage.
- JWT secures protected API endpoints.

---

#  Payment Flow

1. User selects service and confirms booking.
2. Spring Boot creates booking record.
3. Payment service (.NET) creates Razorpay order.
4. Razorpay checkout opens on frontend.
5. Backend verifies payment.
6. Booking status updated after successful transaction.

---

#  Developed By

Nikita Patil  
Computer Engineering Graduate  
PG-DAC Student

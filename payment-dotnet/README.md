# Payment DotNet Microservice

## Overview
This is a secure ASP.NET Core Web API for handling Razorpay payments.
It runs on **http://localhost:5000** and connects to the React frontend on Port 3000.

## Setup Instructions

### 1. Requirements
- .NET 8.0 SDK

### 2. Install Dependencies
```powershell
cd payment-dotnet
dotnet restore
```

### 3. Run the Service
```powershell
dotnet run
```
The service will start at: `http://localhost:5000`

## API Endpoints

### 1. Create Order
**POST** `/api/payment/create-order`
- **Query Param (Optional)**: `amount` (defaults to 500 if not provided)
- **Response**:
```json
{
  "orderId": "order_P7...",
  "amount": 500,
  "currency": "INR",
  "key": "rzp_test_..."
}
```

### 2. Verify Payment
**POST** `/api/payment/verify`
- **Body**:
```json
{
  "razorpay_order_id": "order_P7...",
  "razorpay_payment_id": "pay_29...",
  "razorpay_signature": "e5b..."
}
```
- **Response**: `200 OK` or `400 Bad Request`

## Configuration
Update `appsettings.json` to change Razorpay keys.

```json
  "Razorpay": {
    "KeyId": "YOUR_KEY_ID",
    "KeySecret": "YOUR_KEY_SECRET"
  }
```

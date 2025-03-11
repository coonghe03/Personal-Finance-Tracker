[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/xIbq4TFL)

Name: J Denislas Coonghe
IT No: IT22102928
Email: it22102928@my.sliit.lk
Mobile: 0773666895



# 🏦 Personal Finance Tracker API

Project Overview
The *Personal Finance Tracker API* is a *secure RESTful API* built with *Node.js (Express.js) and MongoDB*.  
It helps users *track expenses, set budgets, manage financial goals, receive notifications, and generate reports*.  

Admin Users*: Manage users, transactions, and system settings.  
Regular Users*: Track personal finances, set budgets, and receive alerts.  

---

## 🚀 Tech Stack
- *Backend*: Node.js, Express.js  
- *Database*: MongoDB 
- *Authentication*: JWT (JSON Web Token)  
- *Testing*: Jest, Supertest  
- *Security*: Helmet, CORS, Password Hashing (bcrypt) 

---

## ⚙️ Setup Instructions

### 1️⃣ *Clone the GitHub Repository*
You must *clone the repository* created by *GitHub Classroom*:
bash
git clone https://github.com/SE1020-IT2070-OOP-DSA-25/project-Yourname
cd project-Yourname


### 2️⃣ Install Dependencies
bash
npm install


### 3️⃣ Set Up Environment Variables
Create a .env file in the root directory and configure it as follows:
ini
PORT=4000
MONGODB_URL = <mongodb url>
JWT_SECRET=your_secret_key_here
EMAIL_USER=<your mail id>
EMAIL_PASS=<password>
FASTFOREX_API_KEY=<fastforex_key>

### 4️⃣ Start the Server
Run the API locally:
bash
npm run dev

The API should now be running at:
➡️ http://localhost:4000

---

## 📌 API Documentation

### 🔹 Authentication
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | User login & get JWT token |
| POST | /api/auth/me | User info |
<!-- | PUT | /api/auth/make-admin | Promote a user to admin (Admin Only) | -->

### 🔹 Transactions
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /api/transactions | Create a new transaction |
| GET | /api/transactions | Retrieve all user transactions |
| DELETE | /api/transactions/:id | Delete a transaction |

### 🔹 Budgets
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /api/budgets | Set a monthly/category budget |
| GET | /api/budgets | Get user's budgets |
| DELETE | /api/budgets/:id | Delete a budget |

### 🔹 Financial Reports
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/reports/spending-trends?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD | View spending trends |
| GET | /api/reports/income-vs-expenses | Compare income vs expenses |

### 🔹 Goals & Savings
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /api/goals | Create a financial goal |
| GET | /api/goals | Get user goals & progress |
| DELETE | /api/goals/:id | Delete a financial goal |

### 🔹 Notifications & Alerts
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/notifications | Get user notifications (budget alerts, reminders) |
| DELETE | /api/notifications/:id | Delete a notification |

### 🔹 Multi-Currency Support
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/currency/rates | Get latest exchange rates (Base: LKR) |
| GET | /api/currency/convert?amount=100&from=USD&to=LKR | Convert amount between currencies |

### 🔹 Role-Based Dashboards
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/dashboard/admin | Admin dashboard (All users & system activity) |
| GET | /api/dashboard/user | User dashboard (Personal finance summary) |

---

## 🧪 Testing Guide

### 1️⃣ Running Unit & Integration Tests
Run all tests:
bash
npm test

✅ Includes Tests for:
- Authentication (authController.test.js)
- Transactions (transactionController.test.js)
<!-- - Budgets & Reports (budgetController.test.js, reportController.test.js) -->
- Integration Tests (integration.test.js)

### 2️⃣ Performance Testing
Use Artillery to test API performance:
bash
npm install -g artillery
artillery run performance-test.yml
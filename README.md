# 🛍️ EliteMart – Full-Stack eCommerce Platform

**EliteMart** is a full-stack eCommerce web application built using the **MERN stack**. It allows users to browse products, manage their cart, securely checkout using PayPal, and track their orders. Admin users can manage products, users, and orders through a dedicated dashboard.

---

## 🚀 Features

- 🛒 Product listing, search, and filtering
- 🔐 JWT-based User Authentication and Authorization
- 🧺 Cart management and secure order placement
- 💳 PayPal payment gateway integration
- 📦 Order history tracking
- 📊 Admin dashboard with CRUD operations for products, users, and orders
- 📱 Fully responsive UI for mobile and desktop
- 🧠 Scalable and modular backend architecture

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Redux Toolkit (or Context API)
- Tailwind CSS
- React Router DOM
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcrypt.js
- PayPal REST API

---

## 📁 Folder Structure (Backend)
- config
- controllers
- data
- lib
- middlewares
- models
- routes
- seeder.js
- server.js


---

## 🧪 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/NikhilNaik23/EliteMart.git
cd EliteMart
```

### 2. Backend Setup

```bash
npm install
npm run dev
```
- Make sure to configure your .env file:

```bash
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```



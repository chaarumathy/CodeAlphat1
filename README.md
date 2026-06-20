# CodeAlphat1
A full-stack e-commerce web application built with Express.js and SQLite.

Features
User registration & login (password hashed with bcryptjs)
Browse products by category
Product detail pages
Shopping cart (add/remove/update quantities)
Order checkout & placement
Order history per user
Session-based authentication
Tech Stack
Layer	Technology
Backend	Node.js, Express.js
Database	SQLite (via sql.js)
Auth	express-session + bcryptjs
Frontend	HTML, CSS, Vanilla JS
Installation
git clone https://github.com/Jenim07/CodeAlpha_Simple-e-commerceStore.git
cd CodeAlpha_Simple-e-commerceStore
npm install
npm run seed   # populate database with 12 sample products
npm start
API Endpoints
Method	Route	Description
POST	/api/auth/register	Create a new account
POST	/api/auth/login	Log in
POST	/api/auth/logout	Log out
GET	/api/products	List all products
GET	/api/products/:id	Get single product
GET	/api/cart	View cart
POST	/api/cart/add	Add item to cart
POST	/api/cart/update	Update cart item quantity
POST	/api/cart/remove	Remove item from cart
POST	/api/orders/checkout	Place an order
GET	/api/orders	View order history
Project Structure
├── public/              # Static frontend files
│   ├── css/style.css
│   ├── js/              # Client-side JS
│   └── *.html           # Pages: home, cart, checkout, orders, etc.
├── routes/              # Express route handlers
│   ├── auth.js
│   ├── cart.js
│   ├── orders.js
│   └── products.js
├── database.js          # SQLite connection & schema
├── seed.js              # Product seeder
├── server.js            # Express app entry point
└── package.json

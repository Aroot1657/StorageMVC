const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Setup
app.use(
    session({
        secret: "super_secret_key", 
        resave: false,
        saveUninitialized: false,
        cookie: { 
            secure: app.get('env') === 'production',
            httpOnly: true 
        }
    })
);

// Middleware to expose session user to all EJS templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Views Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// -------------------------------------------------------------------
// Controllers (Required for route logic)
// -------------------------------------------------------------------

const authController = require("./controllers/authController"); 
// Requires the adminController for storage logic
const admin = require("./controllers/adminController"); 
const adminController = require("./controllers/adminController");

// Customer-facing controllers
const storageController = require("./controllers/storageController");
const customerController = require("./controllers/customerController");
const cartController = require("./controllers/cartController");
const invoiceController = require("./controllers/invoiceController");

// -------------------------------------------------------------------
// Routes (All GET and POST requests are defined here)
// -------------------------------------------------------------------

// GET: Home/Default Route
app.get("/", (req, res) => {
    if (req.session.user) {
        return req.session.user.role === "admin" 
            ? res.redirect("/admin/dashboard") 
            : res.redirect("/customer/dashboard");
    }
    res.render("login");
});

// AUTH ROUTES
// GET: Show Login Form
app.get("/login", authController.showLogin);
// POST: Handle Login Submission
app.post("/login", authController.login);

// GET: Show Register Form
app.get("/register", authController.showRegister);
// POST: Handle Registration Submission
app.post("/register", authController.register);

// GET: Logout and destroy session
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.locals.user = null; 
        res.redirect("/login");
    });
});

// CUSTOMER DASHBOARD
app.get("/customer/dashboard", customerController.dashboard);

// CUSTOMER BROWSE
app.get("/storage", storageController.browse);

// CART ROUTES (persisted in DB)
app.get("/cart", cartController.viewCart);
app.post("/cart/add", cartController.add);
app.post("/cart/update", cartController.update);
app.post("/cart/remove", cartController.remove);

// CHECKOUT + INVOICE ROUTES (UI unchanged)
app.post("/checkout", invoiceController.checkout);
app.get("/payment", invoiceController.paymentForm);
app.post("/payment", invoiceController.processPayment);
app.get("/history", invoiceController.history);

// ADMIN DASHBOARD (The main storage list view)
app.get("/admin/dashboard", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role !== "admin") return res.status(403).send("Not authorized");

    adminController.showStorageList(req, res); // storage list on dashboard
});

// ADMIN USER MANAGEMENT ROUTES

// LIST USERS
app.get("/admin/users", (req, res) => {
    if (!req.session.user || req.session.user.role !== "admin") {
        return res.status(403).send("Not authorized");
    }
    adminController.showUserList(req, res); // ✅ fixed name
});

// EDIT USER
app.get("/admin/users/edit/:id", adminController.showEditUserForm);
app.post("/admin/users/edit/:id", adminController.updateUser);

// DELETE USER
app.get("/admin/users/delete/:id", adminController.deleteUser);

// ADMIN STORAGE MANAGEMENT ROUTES

// ADD STORAGE
app.get("/admin/storage/add", adminController.showAddForm);
app.post("/admin/storage/add", adminController.addStorage);

// EDIT STORAGE
app.get("/admin/storage/edit/:id", adminController.showEditForm);
app.post("/admin/storage/edit/:id", adminController.updateStorage);

// DELETE STORAGE
app.get("/admin/storage/delete/:id", adminController.deleteStorage);

// LIST STORAGE (fallback route)
app.get("/admin/storage", adminController.showStorageList);



// Start Server
app.listen(3000, () => console.log("Server running at http://localhost:3000"));
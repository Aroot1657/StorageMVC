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

// ADMIN DASHBOARD (The main admin panel with overview)
app.get("/admin/dashboard", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role !== "admin") return res.status(403).send("Not authorized");
    
    admin.dashboard(req, res);
});


// -------------------------------------------------------------------
// ADMIN STORAGE MANAGEMENT ROUTES (Defined with app.get/app.post)
// -------------------------------------------------------------------

// Storage List
app.get("/admin/storage", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role !== "admin") return res.status(403).send("Not authorized");
    admin.showStorageList(req, res);
});

// ADD STORAGE
// GET: Show Add Form
app.get("/admin/storage/add", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role !== "admin") return res.status(403).send("Not authorized");
    admin.showAddForm(req, res);
});
// POST: Handle Add Submission
app.post("/admin/storage/add", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role !== "admin") return res.status(403).send("Not authorized");
    admin.addStorage(req, res);
});

// EDIT STORAGE
// GET: Show Edit Form (e.g., /admin/storage/edit/1)
app.get("/admin/storage/edit/:id", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role !== "admin") return res.status(403).send("Not authorized");
    admin.showEditForm(req, res);
});
// POST: Handle Edit Submission
app.post("/admin/storage/edit/:id", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role !== "admin") return res.status(403).send("Not authorized");
    admin.updateStorage(req, res);
});

// DELETE STORAGE
// GET: Handle Deletion (e.g., /admin/storage/delete/1)
app.get("/admin/storage/delete/:id", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role !== "admin") return res.status(403).send("Not authorized");
    admin.deleteStorage(req, res);
});


// -------------------------------------------------------------------
// ADMIN USER MANAGEMENT ROUTES
// -------------------------------------------------------------------

// User List
app.get("/admin/users", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role !== "admin") return res.status(403).send("Not authorized");
    admin.showUserList(req, res);
});

// EDIT USER
// GET: Show Edit Form
app.get("/admin/users/edit/:id", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role !== "admin") return res.status(403).send("Not authorized");
    admin.showEditUserForm(req, res);
});
// POST: Handle Edit Submission
app.post("/admin/users/edit/:id", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role !== "admin") return res.status(403).send("Not authorized");
    admin.updateUser(req, res);
});

// DELETE USER
app.get("/admin/users/delete/:id", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role !== "admin") return res.status(403).send("Not authorized");
    admin.deleteUser(req, res);
});


// -------------------------------------------------------------------
// ADMIN BOOKING MANAGEMENT ROUTES
// -------------------------------------------------------------------

// Booking List
app.get("/admin/bookings", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role !== "admin") return res.status(403).send("Not authorized");
    admin.showBookingList(req, res);
});

// EDIT BOOKING
// GET: Show Edit Form
app.get("/admin/bookings/edit/:id", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role !== "admin") return res.status(403).send("Not authorized");
    admin.showEditBookingForm(req, res);
});
// POST: Handle Edit Submission
app.post("/admin/bookings/edit/:id", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role !== "admin") return res.status(403).send("Not authorized");
    admin.updateBooking(req, res);
});

// DELETE BOOKING
app.get("/admin/bookings/delete/:id", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role !== "admin") return res.status(403).send("Not authorized");
    admin.deleteBooking(req, res);
});


// Start Server
app.listen(3000, () => console.log("Server running at http://localhost:3000"));
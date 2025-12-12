const express = require("express");
const router = express.Router();
const db = require("../config/database");
const admin = require("../controllers/adminController");

// Middleware to check admin
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === "admin") {
        return next();
    }
    return res.status(403).send("Access denied");
}

// -------------------------
// STORAGE MANAGEMENT
// -------------------------

router.get("/admin/storage", isAdmin, admin.showStorageList);

router.get("/admin/storage/add", isAdmin, admin.showAddForm);
router.post("/admin/storage/add", isAdmin, admin.addStorage);

router.get("/admin/storage/edit/:id", isAdmin, admin.showEditForm);
router.post("/admin/storage/edit/:id", isAdmin, admin.updateStorage);

router.get("/admin/storage/delete/:id", isAdmin, admin.deleteStorage);

// -------------------------
// USER MANAGEMENT
// -------------------------
router.get("/admin/manage-users", isAdmin, (req, res) => {
    db.query("SELECT user_id, name, email, role FROM users", (err, results) => {
        if (err) throw err;
        res.render("manage-users", { users: results });
    });
});

module.exports = router;

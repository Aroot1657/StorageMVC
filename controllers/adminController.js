const Storage = require("../models/Storage");
const db = require('../config/db'); 

module.exports = {
    showStorageList: (req, res) => {
        Storage.getAll((err, storage) => {
            res.render("admin_view_storage", { storage });
        });
    },

    showAddForm: (req, res) => {
        res.render("admin_add_storage");
    },

    addStorage: (req, res) => {
        Storage.create(req.body, () => {
            res.redirect("/admin/dashboard",);
        });
    },

    showEditForm: (req, res) => {
        Storage.findById(req.params.id, (err, results) => {
            res.render("admin_edit_storage", { storage: results[0] });
        });
    },

    updateStorage: (req, res) => {
        Storage.update(req.params.id, req.body, () => {
            res.redirect("/admin/storage");
        });
    },

    deleteStorage: (req, res) => {
        Storage.remove(req.params.id, () => {
            res.redirect("/admin/storage");
        });
    }
};


module.exports = {
    // -------------------------
    // STORAGE MANAGEMENT
    // -------------------------
    showStorageList: (req, res) => {
        Storage.getAll((err, storage) => {
            res.render("admin_view_storage", { storage });
        });
    },

    showAddForm: (req, res) => {
        res.render("admin_add_storage");
    },

    addStorage: (req, res) => {
        Storage.create(req.body, () => {
            res.redirect("/admin/dashboard");
        });
    },

    showEditForm: (req, res) => {
        Storage.findById(req.params.id, (err, results) => {
            res.render("admin_edit_storage", { storage: results[0] });
        });
    },

    updateStorage: (req, res) => {
        Storage.update(req.params.id, req.body, () => {
            res.redirect("/admin/storage");
        });
    },

    deleteStorage: (req, res) => {
        Storage.remove(req.params.id, () => {
            res.redirect("/admin/storage");
        });
    },

    // -------------------------
    // USER MANAGEMENT
    // -------------------------
    showUsersList: (req, res) => {
        db.query("SELECT * FROM users", (err, users) => {
            res.render("admin_user_details", { users });
        });
    },

    showEditUserForm: (req, res) => {
        db.query("SELECT * FROM users WHERE user_id = ?", [req.params.id], (err, results) => {
            res.render("edit-user", { user: results[0] });
        });
    },

    updateUser: (req, res) => {
        db.query(
            "UPDATE users SET name = ?, email = ?, role = ? WHERE user_id = ?",
            [req.body.name, req.body.email, req.body.role, req.params.id],
            () => res.redirect("/admin/users")
        );
    },

    deleteUser: (req, res) => {
        db.query("DELETE FROM users WHERE user_id = ?", [req.params.id], () => {
            res.redirect("/admin/users");
        });
    }
};

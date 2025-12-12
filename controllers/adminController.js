const Storage = require("../models/Storage");

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

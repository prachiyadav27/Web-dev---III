
const express = require("express");

const router = express.Router();

const {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
    adminAllNotes
} = require("../controllers/noteController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/auth");

// All note routes require authentication
router.use(authenticateToken);

// CREATE
router.post("/", createNote);

// READ ALL OWN NOTES
router.get("/", getNotes);

// ADMIN ONLY ROUTE
router.get(
    "/admin/all",
    authorizeRoles("admin"),
    adminAllNotes
);

// READ SINGLE NOTE
router.get("/:id", getNoteById);

// UPDATE
router.put("/:id", updateNote);

// DELETE
router.delete("/:id", deleteNote);

module.exports = router;

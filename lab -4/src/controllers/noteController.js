
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

// CREATE NOTE
async function createNote(req, res) {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const note = {
            title: title.trim(),
            content: content.trim(),
            ownerId: req.user.id,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await getDB()
            .collection("notes")
            .insertOne(note);

        res.status(201).json({
            message: "Note created successfully",
            note: {
                ...note,
                _id: result.insertedId
            }
        });

    } catch (error) {
        console.log("Create Note Error:", error.message);

        res.status(500).json({
            message: "Could not create note"
        });
    }
}


// GET ALL USER NOTES
async function getNotes(req, res) {
    try {
        const notes = await getDB()
            .collection("notes")
            .find({ ownerId: req.user.id })
            .sort({ createdAt: -1 })
            .toArray();

        res.status(200).json({
            count: notes.length,
            notes
        });

    } catch (error) {
        res.status(500).json({
            message: "Could not fetch notes"
        });
    }
}


// GET SINGLE NOTE
async function getNoteById(req, res) {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid note ID"
            });
        }

        const note = await getDB()
            .collection("notes")
            .findOne({
                _id: new ObjectId(req.params.id),
                ownerId: req.user.id
            });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.status(200).json({ note });

    } catch (error) {
        res.status(500).json({
            message: "Could not fetch note"
        });
    }
}


// UPDATE NOTE
async function updateNote(req, res) {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid note ID"
            });
        }

        const updates = {};

        if (typeof req.body.title === "string") {
            updates.title = req.body.title.trim();
        }

        if (typeof req.body.content === "string") {
            updates.content = req.body.content.trim();
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "Provide title or content"
            });
        }

        updates.updatedAt = new Date();

        const result = await getDB()
            .collection("notes")
            .findOneAndUpdate(
                {
                    _id: new ObjectId(req.params.id),
                    ownerId: req.user.id
                },
                { $set: updates },
                { returnDocument: "after" }
            );

        if (!result) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.status(200).json({
            message: "Note updated successfully",
            note: result
        });

    } catch (error) {
        res.status(500).json({
            message: "Could not update note"
        });
    }
}


// DELETE NOTE
async function deleteNote(req, res) {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid note ID"
            });
        }

        const result = await getDB()
            .collection("notes")
            .deleteOne({
                _id: new ObjectId(req.params.id),
                ownerId: req.user.id
            });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.status(200).json({
            message: "Note deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Could not delete note"
        });
    }
}


// ADMIN: GET ALL NOTES
async function adminAllNotes(req, res) {
    try {
        const notes = await getDB()
            .collection("notes")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        res.status(200).json({
            count: notes.length,
            notes
        });

    } catch (error) {
        res.status(500).json({
            message: "Could not fetch all notes"
        });
    }
}


module.exports = {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
    adminAllNotes
};

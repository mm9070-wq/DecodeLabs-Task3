const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// Create or connect to database
const db = new sqlite3.Database("users.db");

// Create table
db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
)
`);

// GET all users
app.get("/users", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// POST new user
app.post("/users", (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Name is required"
        });
    }

    db.run(
        "INSERT INTO users(name) VALUES(?)",
        [name],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                message: "User added successfully",
                id: this.lastID
            });
        }
    );
});
// UPDATE user
app.put("/users/:id", (req, res) => {

    const { name } = req.body;
    const id = req.params.id;

    db.run(
        "UPDATE users SET name = ? WHERE id = ?",
        [name, id],
        function(err) {

            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                message: "User updated successfully"
            });
        }
    );
});
// DELETE user
app.delete("/users/:id", (req, res) => {

    const id = req.params.id;

    db.run(
        "DELETE FROM users WHERE id = ?",
        [id],
        function(err) {

            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                message: "User deleted successfully"
            });
        }
    );
});
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
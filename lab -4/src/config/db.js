
const { MongoClient } = require("mongodb");

let client;
let db;

async function connectDB() {
    try {
        client = new MongoClient(process.env.MONGODB_URI);

        await client.connect();

        db = client.db(process.env.DB_NAME);

        console.log("MongoDB Connected Successfully!");
        console.log("Database:", process.env.DB_NAME);

    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        throw error;
    }
}

function getDB() {
    if (!db) {
        throw new Error("Database is not connected");
    }

    return db;
}

module.exports = { connectDB, getDB };

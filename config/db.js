const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define database path
const dbPath = path.resolve(__dirname, '../eduflow.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Error with the database:', err.message);
    else console.log('Connected to SQLite database.');
});

db.serialize(() => {
    // 1. User Table (Generalization)
    db.run(`CREATE TABLE IF NOT EXISTS USER (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        FULL_NAME TEXT NOT NULL,
        EMAIL TEXT UNIQUE NOT NULL,
        PASSWORD_HASH TEXT NOT NULL,
        ROLE TEXT CHECK(ROLE IN ('student', 'faculty', 'admin')) NOT NULL,
        CREATED_AT DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 2. Submissions Table
    db.run(`CREATE TABLE IF NOT EXISTS SUBMISSION (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        ASSIGNMENT_ID INTEGER,
        STUDENT_ID INTEGER,
        FILE_PATH TEXT NOT NULL,
        FILE_TYPE TEXT,
        SUBMITTED_AT DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (STUDENT_ID) REFERENCES USER(ID)
    )`);

    // 3. Notifications Table
    db.run(`CREATE TABLE IF NOT EXISTS NOTIFICATION (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        USER_ID INTEGER,
        MESSAGE TEXT NOT NULL,
        IS_READ INTEGER DEFAULT 0,
        CREATED_AT DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (USER_ID) REFERENCES USER(ID)
    )`);
});

module.exports = db;
const db = require('../config/db');

exports.submitAssignment = (req, res) => {
    const studentId = req.user.id;
    const { assignmentId, instructorId } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;

    const query = `INSERT INTO SUBMISSION (ASSIGNMENT_ID, STUDENT_ID, FILE_PATH, FILE_TYPE) VALUES (?, ?, ?, ?)`;

    db.run(query, [assignmentId, studentId, filePath, fileType], function(err) {
        if (err) return res.status(500).json({ error: err.message });

        console.log(`[SUBMISSION] Student ${studentId} uploaded file type: ${fileType}`);

        //Notification for Instructor
        if (instructorId) {
            const notifMsg = `Student ID ${studentId} submitted a new assignment.`;
            db.run(`INSERT INTO NOTIFICATION (USER_ID, MESSAGE) VALUES (?, ?)`, [instructorId, notifMsg], (err) => {
                if (!err) console.log(`[NOTIF] Sent to Instructor ${instructorId}`);
            });
        }

        res.status(201).json({ message: "Assignment submitted successfully" });
    });
};
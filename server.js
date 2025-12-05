const express = require('express');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const authController = require('./controllers/authController');
const submissionController = require('./controllers/submissionController');

const app = express();
const PORT = 3000;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

//SECURITY MIDDLEWARE
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Access Denied. Not Authenticated." });

    jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid Token" });

        // Device Fingerprint Check
        const currentAgent = req.headers['user-agent'] || 'unknown';
        if (decoded.userAgent !== currentAgent) {
            return res.status(403).json({ message: "Security Violation: Browser mismatch." });
        }
        if (decoded.ip !== req.ip) {
            return res.status(403).json({ message: "Security Violation: Device mismatch." });
        }

        req.user = decoded;
        next();
    });
};

//ROUTES

// Auth Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/logout', authController.logout);

// Submission Route
app.post('/api/submit', verifyToken, upload.single('courseWork'), submissionController.submitAssignment);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 EduFlow Server running on port ${PORT}`);
});
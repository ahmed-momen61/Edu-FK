const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Link the Token with the Device Fingerprinting
const signToken = (id, role, req) => {
    const userAgent = req.headers['user-agent'] || 'unknown';
    const ip = req.ip;

    return jwt.sign({ id, role, userAgent, ip },
        process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' }
    );
};

// Register User
exports.register = (req, res) => {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
        return res.status(400).json({ message: "please make sure you filled out the all fields" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Using parameterized for Injection protection
    const query = `INSERT INTO USER (FULL_NAME, EMAIL, PASSWORD_HASH, ROLE) VALUES (?, ?, ?, ?)`;

    db.run(query, [fullName, email, hash, role], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE')) return res.status(400).json({ message: "you already have an account" });
            return res.status(500).json({ error: err.message });
        }
        console.log(`[AUTH] New User Registered: ${email}`);
        res.status(201).json({ message: "User registered successfully", userId: this.lastID });
    });
};

// Login User
exports.login = (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM USER WHERE EMAIL = ?`;

    db.get(query, [email], (err, user) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (!user) {
            console.log(`[AUTH FAIL] IP: ${req.ip} - User not found...please sign up first`);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = bcrypt.compareSync(password, user.PASSWORD_HASH);
        if (!isMatch) {
            console.log(`[AUTH FAIL] IP: ${req.ip} - Wrong password`);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate Token
        const token = signToken(user.ID, user.ROLE, req);

        // Set HttpOnly Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 3600000
        });

        console.log(`[AUTH SUCCESS] User ${user.ID} logged in.`);

        res.json({
            message: `welcome ${FULL_NAME} :)`,
            user: {
                id: user.ID,
                email: user.EMAIL,
                role: user.ROLE,
                fullName: user.FULL_NAME
            }
        });
    });
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: "see you soon :(" });
};
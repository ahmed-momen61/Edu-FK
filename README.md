# EduFlow-Knowledge | Backend System (Draft)

>**Course:** Internet & Web Technologies  
> **Student:** Ahmed Mo'men  
> **ID:** 202301532

##Project Overview
**EduFlow-Knowledge** is a robust backend system designed for a Learning Management System (LMS). It handles user authentication, secure session management, assignment submissions, and automated notifications. The system is built with **Node.js** and **SQLite**, prioritizing security and performance.

---

## 🛠️ Tech Stack & Tools
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** SQLite3 (Standard Native Driver)
* **Security:**
    * `bcryptjs` (Password Hashing)
    * `jsonwebtoken` (JWT for Sessions)
    * `cookie-parser` (HttpOnly Cookies)
    * Device Fingerprinting (IP & Browser Binding)
    * SQL Injection Protection (Parameterized Queries)
* **File Handling:** Multer (Multimedia Support)

---

## ✨ Key Features (Milestone 4)
1.  **Secure Authentication:**
    * User Registration & Login.
    * **HttpOnly Cookies** used for token storage (XSS Protection).
    * **Device Binding:** Tokens are locked to the user's IP and User-Agent to prevent session hijacking.
2.  **Role-Based Access Control:**
    * Supports `Admin`, `Faculty`, and `Student` roles via a generalized User table.
3.  **Submission System:**
    * Students can upload assignment files (PDFs, Images, etc.).
    * Uploads are stored locally, and paths are saved in the database.
4.  **Automated Notifications:**
    * Triggers a database notification for the instructor immediately upon student submission.

---

## 📂 Project Structure
```text
Edu-FK/
│
├── config/             
│   └── db.js
├── controllers/         # Logic for Auth and Submissions
│   ├── authController.js
│   └── submissionController.js
├── uploads/             # Storage for student files
├── node_modules/        # Dependencies
├── .gitignore           # Git ignore rules
├── server.js            # Main Application Entry Point
├── test.js              # Database Seeding Script (Test Data)
├── package.json         # Project Metadata
└── README.md            # Documentation

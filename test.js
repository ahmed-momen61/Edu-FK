const db = require('./config/db');
const bcrypt = require('bcryptjs');

//Users List
const testUsers = [
    // Admin (Technical Support)
    {
        Name: "Hassan Al-Hakamdar",
        email: "hassan.admin@tkh.edu.eg",
        role: "admin",
        password: "hassan_pass_admin"
    },

    //Faculty
    {
        Name: "Dr. Amir Tarek",
        email: "amir.tarek@tkh.edu.eg",
        role: "faculty",
        password: "amir_pass_123"
    },
    {
        Name: "Eng. Nour",
        email: "nour.ta@tkh.edu.eg",
        role: "faculty",
        password: "nour_pass_123"
    },
    {
        Name: "Eng. Mariam Abdelati",
        email: "mariam.abdelati@tkh.edu.eg",
        role: "faculty",
        password: "mariam_pass_123"
    },

    // Students
    {
        Name: "Ahmed Mo'men",
        email: "aa2301532@tkh.edu.eg",
        role: "student",
        password: "ahmed_pass_2023"
    },
    {
        Name: "Karim Abdullah",
        email: "ka2301533@tkh.edu.eg",
        role: "student",
        password: "karim_pass_1"
    },
    {
        Name: "Mohamed Hazem",
        email: "mh2301534@tkh.edu.eg",
        role: "student",
        password: "hazem_pass_2"
    },
    {
        Name: "Mohamed Khaled",
        email: "mk2301535@tkh.edu.eg",
        role: "student",
        password: "khaled_pass_3"
    },
    {
        Name: "Mohamed Rouhi",
        email: "mr2301536@tkh.edu.eg",
        role: "student",
        password: "rouhi_pass_4"
    },
    {
        Name: "Yassin Ahmed",
        email: "ya2301537@tkh.edu.eg",
        role: "student",
        password: "yassin_pass_5"
    },
    {
        Name: "Jana Ashraf",
        email: "ja2301538@tkh.edu.eg",
        role: "student",
        password: "jana_pass_6"
    },
    {
        Name: "Nour Essam",
        email: "ne2301539@tkh.edu.eg",
        role: "student",
        password: "nour_st_pass_7"
    },
    {
        Name: "Ali Rushdy",
        email: "ar2301540@tkh.edu.eg",
        role: "student",
        password: "ali_pass_8"
    }
];

//start testing
db.serialize(() => {
    console.log("Starting Test Data Insertion...");


    const stmt = db.prepare("INSERT INTO USER (FULL_NAME, EMAIL, PASSWORD_HASH, ROLE) VALUES (?, ?, ?, ?)");

    // Counter to track async operations
    let completed = 0;

    //check if all done
    const checkCompletion = () => {
        completed++;
        if (completed === testUsers.length) {
            stmt.finalize(() => {
                console.log("\nTest Environment Ready! All users processed.");
            });
        }
    };

    testUsers.forEach((user) => {
        // Check if user exists
        db.get("SELECT EMAIL FROM USER WHERE EMAIL = ?", [user.email], (err, row) => {
            if (!row) {
                // Hash password
                const hash = bcrypt.hashSync(user.password, 10);

                // Insert user
                stmt.run(user.Name, user.email, hash, user.role, (err) => {
                    if (err) {
                        console.error(`Insert Failed: ${user.Name}`, err.message);
                    } else {
                        console.log(`User Added: ${user.Name} (${user.role})`);
                    }

                    checkCompletion();
                });
            } else {
                console.log(`Skipped: ${user.Name} (Already in DB)`);

                checkCompletion();
            }
        });
    });
});
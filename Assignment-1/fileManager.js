const fs = require("fs");

const fileName = "test.txt";

// 1. CREATE FILE + WRITE CONTENT
fs.writeFile(fileName, "Hello! This is my File Manager project.", (err) => {
    if (err) {
        console.log("Error creating file:", err);
        return;
    }

    console.log("File created successfully.");

    // 2. READ FILE
    fs.readFile(fileName, "utf8", (err, data) => {
        if (err) {
            console.log("Error reading file:", err);
            return;
        }

        console.log("File content:");
        console.log(data);

        // 3. UPDATE FILE
        fs.appendFile(fileName, "\nThis content was added during update.", (err) => {
            if (err) {
                console.log("Error updating file:", err);
                return;
            }

            console.log("File updated successfully.");

            // 4. READ UPDATED FILE
            fs.readFile(fileName, "utf8", (err, updatedData) => {
                if (err) {
                    console.log("Error reading updated file:", err);
                    return;
                }

                console.log("Updated file content:");
                console.log(updatedData);
            });
        });
    });
});

// 5. DELETE FILE
// Abhi delete nahi karna hai.
// fs.unlink(fileName, (err) => {
//     if (err) {
//         console.log("Error deleting file:", err);
//         return;
//     }
//     console.log("File deleted successfully.");
// });
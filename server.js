const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Path to the Notepad file
const filePath = path.join(__dirname, 'notepad.txt');

// Variable to store the debounce timer
let debounceTimeout;

// Monitor the Notepad file for changes
fs.watchFile(filePath, (curr, prev) => {
    console.log('File change detected');
    
    // Clear the previous debounce timer if it exists
    if (debounceTimeout) {
        clearTimeout(debounceTimeout);
    }

    // Set a new debounce timer for 5 seconds
    debounceTimeout = setTimeout(() => {
        // Read the file content after the debounce period
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }

            const searchQuery = data.trim();
            if (searchQuery.length > 0) {
                console.log(`Performing Google search for query: "${searchQuery}"`);
                searchGoogle(searchQuery);
            }
        });
    }, 5000); // 5000ms = 5 seconds
});

// Function to open Chrome and perform a Google search
function searchGoogle(query) {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    console.log(`Opening browser with URL: ${url}`);

    // Use exec to open Chrome and search in Google (on Windows)
    exec(`start chrome "${url}"`, (err) => {
        if (err) {
            console.error('Error opening browser:', err);
        } else {
            console.log('Browser opened successfully.');
        }
    });
}

// Start the file monitoring process
console.log(`Monitoring file: ${filePath}`);

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const testDir = './tests'; // Directory containing your test JSON files

// Expected results for each test file
const expectedResults = {
    'valid1.json': 'Valid JSON',
    'valid2.json': 'Valid JSON',
    'invalid1.json': 'Error: Missing , between array elements on line 4',
    'invalid2.json': 'Error: Expected ] on line 3',
    // Add other expected results for your test cases here
};

fs.readdir(testDir, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        const filePath = path.join(testDir, file);
        exec(`node cli.js "${filePath}"`, (err, stdout, stderr) => {
            if (err) {
                console.log(`Testing file: ${file}`);
                console.error(`${expectedResults[file]}`);
                console.error(`Actual: ${stderr.trim()}`);
                console.error('Test failed!\n');
            } else {
                console.log(`Testing file: ${file}`);
                console.log(`Expected: ${expectedResults[file]}`);
                console.log(`Actual: ${stdout.trim()}`);
                if (stdout.trim() === expectedResults[file]) {
                    console.log('Test passed!\n');
                } else {
                    console.error('Test failed!\n');
                }
            }
        });
    });
});

const fs = require('fs');
const path = require('path');

// Define input and output file paths
const inputFile = 'public/data/jobs.json'
const outputFile = 'public/data/jobs.json'

try {
    // Read the JSON file
    const rawData = fs.readFileSync(inputFile, 'utf8');
    const jobs = JSON.parse(rawData);

    // Swap category and subcategory
    jobs.forEach(job => {
        [job.category, job.subcategory] = [job.subcategory, job.category];
    });

    // Write updated data to a new JSON file
    fs.writeFileSync(outputFile, JSON.stringify(jobs, null, 2), 'utf8');

    console.log('✅ Category and Subcategory have been swapped successfully!');
    console.log(`Updated JSON saved to: ${outputFile}`);
} catch (error) {
    console.error('❌ Error processing the file:', error.message);
}

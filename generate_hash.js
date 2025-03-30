const bcrypt = require('bcrypt');

// Read password from command line arguments
const password = process.argv[2];

if (!password) {
    console.log('Please provide a password as an argument');
    console.log('Usage: node generate_hash.js 123');
    process.exit(1);
}

// Generate hash
bcrypt.hash(password, 10).then(hash => {
    console.log('Generated hash:', hash);
    console.log('\nYou can now use this hash in your sample_tasks.sql file');
}); 
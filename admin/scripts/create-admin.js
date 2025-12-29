// Script to create admin user
// Run with: node scripts/create-admin.js

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, '../../amrin-23546-firebase-adminsdk-fbsvc-328ee65915.json'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

async function createAdminUser() {
    try {
        const user = await admin.auth().createUser({
            email: 'admin@amrinexclusive.com',
            password: 'admin123',
            displayName: 'Amrin Admin'
        });

        console.log('✅ Admin user created successfully!');
        console.log('Email:', user.email);
        console.log('UID:', user.uid);
        console.log('\n📝 Login credentials:');
        console.log('Email: admin@amrinexclusive.com');
        console.log('Password: admin123');

        process.exit(0);
    } catch (error) {
        if (error.code === 'auth/email-already-exists') {
            console.log('⚠️  User already exists with this email.');
            console.log('You can log in with:');
            console.log('Email: admin@amrinexclusive.com');
            console.log('Password: (use existing password or reset it)');
        } else {
            console.error('❌ Error creating user:', error.message);
        }
        process.exit(1);
    }
}

createAdminUser();

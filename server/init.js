const { initDatabase, promisify } = require('./database');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function initialize() {
  console.log('🚀 Initializing Balaji Ghee Master Panel...\n');

  // Initialize database
  const db = initDatabase();
  const dbAsync = promisify(db);

  // Wait for database to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('✅ Database initialized\n');

  // Check if users exist
  const existingUsers = await dbAsync.all('SELECT COUNT(*) as count FROM users');
  const userCount = existingUsers[0]?.count || 0;

  if (userCount > 0) {
    console.log('ℹ️  Database already has users. Skipping user creation.');
    process.exit(0);
  }

  console.log('📝 Create your first MASTER admin account:\n');

  // Collect user info
  const email = await question('Email: ');
  const password = await question('Password (min 6 chars): ');

  if (password.length < 6) {
    console.error('❌ Password must be at least 6 characters');
    process.exit(1);
  }

  try {
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert MASTER user
    await dbAsync.run(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, passwordHash, 'MASTER']
    );

    console.log('\n✅ MASTER account created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log('🔑 You can now login to the Master Panel\n');
    console.log('👉 Next steps:');
    console.log('   1. Run: npm run dev:full');
    console.log('   2. Open: http://localhost:3000');
    console.log('   3. Click "Master Panel" button');
    console.log('   4. Login with your credentials\n');

  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    process.exit(1);
  }

  rl.close();
  process.exit(0);
}

function question(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

initialize().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});


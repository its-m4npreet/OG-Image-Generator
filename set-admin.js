#!/usr/bin/env node

const { Pool } = require('pg');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function listUsers() {
  try {
    const result = await pool.query('SELECT id, email, role FROM users ORDER BY email');
    console.log('\n📋 Current Users:');
    console.log('='.repeat(60));
    result.rows.forEach((row, idx) => {
      console.log(`${idx + 1}. ${row.email} (Role: ${row.role || 'user'})`);
    });
    console.log('='.repeat(60) + '\n');
    return result.rows;
  } catch (error) {
    console.error('❌ Error listing users:', error.message);
    process.exit(1);
  }
}

async function setAdmin(email) {
  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE email = $2 RETURNING email, role',
      ['admin', email]
    );
    
    if (result.rows.length === 0) {
      console.log(`❌ User with email "${email}" not found`);
      return false;
    }
    
    console.log(`✅ User ${email} is now an admin`);
    return true;
  } catch (error) {
    console.error('❌ Error setting admin:', error.message);
    return false;
  }
}

async function main() {
  try {
    const users = await listUsers();
    
    if (users.length === 0) {
      console.log('❌ No users found in the database');
      process.exit(1);
    }

    rl.question('Enter the email of the user to make admin (or press Ctrl+C to cancel):\n> ', async (email) => {
      const trimmedEmail = email.trim();
      const success = await setAdmin(trimmedEmail);
      
      if (success) {
        console.log('\n✅ Done! User should now see the "Manage Templates" button on their next login.');
      }
      
      pool.end();
      process.exit(success ? 0 : 1);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

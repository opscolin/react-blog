import bcrypt from 'bcrypt';
import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const dbPath = path.join(__dirname, '../data/blog.db');
const dataDir = path.dirname(dbPath);

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

const schemaPath = path.join(__dirname, '../src/db/schema.sql');
if (fs.existsSync(schemaPath)) {
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('=== Blog Admin Account Initialization ===\n');

  const username = await question('Enter admin username (default: admin): ');
  const finalUsername = username.trim() || 'admin';

  const password = await question('Enter admin password: ');
  if (!password) {
    console.error('Password is required');
    process.exit(1);
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(finalUsername);

  if (existing) {
    console.log(`User "${finalUsername}" already exists. Updating password...`);
    const hash = bcrypt.hashSync(password, 12);
    db.prepare('UPDATE users SET password_hash = ? WHERE username = ?').run(hash, finalUsername);
    console.log('Password updated successfully!');
  } else {
    console.log(`Creating user "${finalUsername}"...`);
    const hash = bcrypt.hashSync(password, 12);
    db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(finalUsername, hash);
    console.log('Admin account created successfully!');
  }

  rl.close();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

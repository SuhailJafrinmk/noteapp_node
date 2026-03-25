require('dotenv').config();
const pool = require('./app/database/mysql');

async function migrate() {
    try {
        console.log('Running migration...');
        const query = `
      ALTER TABLE users 
      ADD COLUMN userCategory INT DEFAULT 2 COMMENT '1: admin, 2: normal user';
    `;
        await pool.execute(query);
        console.log('Migration successful: userCategory column added to users table.');
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('Migration skipped: userCategory column already exists.');
        } else {
            console.error('Migration failed:', error);
        }
    } finally {
        process.exit();
    }
}

migrate();

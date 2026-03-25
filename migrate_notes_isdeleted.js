require('dotenv').config();
const pool = require('./app/database/mysql');

async function migrate() {
    try {
        console.log('Running migration...');
        const query = `
      ALTER TABLE notes 
      ADD COLUMN isDeleted INT DEFAULT 0 COMMENT '0: active, 1: deleted';
    `;
        await pool.execute(query);
        console.log('Migration successful: isDeleted column added to notes table.');
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('Migration skipped: isDeleted column already exists.');
        } else {
            console.error('Migration failed:', error);
        }
    } finally {
        process.exit();
    }
}

migrate();

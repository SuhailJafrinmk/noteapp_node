const pool = require('../database/mysql')

const createNote = async (userId, title, content) => {
  const [result] = await pool.execute(
    'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
    [userId, title, content]
  )
  return result.insertId
}

module.exports = {
  createNote
}

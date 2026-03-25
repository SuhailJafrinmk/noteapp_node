const pool = require('../database/mysql')

const createNote = async (userId, title, content) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
      [userId, title, content]
    )

    return result.insertId

  } catch (error) {
    console.error("Error creating note:", error)
    throw error
  }
}

const getAllNotes = async (userId) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM notes WHERE user_id = ? AND isDeleted = 0 ORDER BY id DESC',
      [userId]
    )
    return rows
  } catch (error) {
    console.error("Error fetching notes:", error)
    throw error
  }
}

const getNoteById = async (noteId, userId) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM notes WHERE id = ? AND user_id = ? AND isDeleted = 0',
      [noteId, userId]
    )
    return rows[0]
  } catch (error) {
    console.error("Error fetching note by ID:", error)
    throw error
  }
}

const updateNote = async (noteId, userId, title, content) => {
  try {
    const [result] = await pool.execute(
      'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?',
      [title, content, noteId, userId]
    )
    return result.affectedRows > 0
  } catch (error) {
    console.error("Error updating note:", error)
    throw error
  }
}

const deleteNote = async (noteId, userId) => {
  try {
    const [result] = await pool.execute(
      'UPDATE notes SET isDeleted = 1 WHERE id = ? AND user_id = ? AND isDeleted = 0',
      [noteId, userId]
    )
    return result.affectedRows > 0
  } catch (error) {
    console.error("Error deleting note:", error)
    throw error
  }
}

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote
}

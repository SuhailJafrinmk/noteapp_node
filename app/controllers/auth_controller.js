const pool = require('../database/mysql')
const bcrypt = require('bcrypt')

exports.register = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' })


  const hashed = await bcrypt.hash(password, 10)

  try {
    await pool.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashed]
    )

    res.status(201).json({ message: 'User registered' })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists' })
    }
    res.status(500).json({ message: 'Server error' })
  }
}

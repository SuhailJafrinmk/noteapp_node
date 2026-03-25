const pool = require('../database/mysql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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

exports.login = async (req, res) => {
  const { email, password } = req.body
  console.log('login request recieved');
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' })

  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  )

  if (rows.length === 0) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const user = rows[0]
  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, userCategory: user.userCategory },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )

  res.json({ token })
}

// middleware/auth.middleware.js
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  console.log(token)
  if (!token) {
    console.log('No token provided')
    return res.status(401).json({ message: 'No token provided' })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('token decoded')
    req.user = decoded
    next()
  } catch {
    console.log('invalid token')
    return res.status(401).json({ message: 'Invalid token' })
  }
}

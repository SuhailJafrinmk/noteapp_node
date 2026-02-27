const pool = require('./app/database/mysql')

;(async () => {
  try {
    const connection = await pool.getConnection()
    console.log('MySQL connected ✅')
    connection.release()
    process.exit(0)
  } catch (err) {
    console.error('MySQL connection failed ❌:', err.message)
    process.exit(1)
  }
})()

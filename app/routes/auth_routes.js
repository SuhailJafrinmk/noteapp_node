const authController = require('../controllers/auth_controller')

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.send('hello world')
  })
  app.post('/auth/register', authController.register)
  app.post('/auth/login', authController.login)
}

const authController = require('../controllers/auth_controller')

module.exports = (app) => {
  app.post('/auth/register', authController.register)
}

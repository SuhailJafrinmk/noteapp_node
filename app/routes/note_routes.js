const noteController = require('../controllers/note_controller')
const authMiddleware = require('../middleware/auth_midlleware')

module.exports = (app) => {
    app.post('/note/add', authMiddleware, noteController.createNote)
    app.get('/note/getAll', authMiddleware, noteController.getAllNotes)
    app.get('/note/:id', authMiddleware, noteController.getNoteById)
    app.put('/note/update/:id', authMiddleware, noteController.updateNote)
    app.delete('/note/delete/:id', authMiddleware, noteController.deleteNote)
    app.get('/placeholder/getAll', authMiddleware, noteController.getPlaceholders)
}

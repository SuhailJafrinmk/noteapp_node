const noteModel = require('../models/note_models')
const jwt = require('jsonwebtoken')
const middleware = require('../middleware/auth_midlleware')
const axios = require('axios')

exports.createNote = async (req, res) => {
  try {
    console.log('request for note add recieved')
    console.log("body:", req.body)
    console.log("user:", req.user)
    const { title, content } = req.body

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const userId = req.user.id
    const noteId = await noteModel.createNote(userId, title, content)
    return res.json({
      success: true,
      message: "Note created successfully",
      noteId: noteId
    })


  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getAllNotes = async (req, res) => {
  try {
    const userId = req.user.id
    const notes = await noteModel.getAllNotes(userId)
    return res.json({
      success: true,
      data: notes
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getNoteById = async (req, res) => {
  try {
    const userId = req.user.id
    const noteId = req.params.id
    const note = await noteModel.getNoteById(noteId, userId)
    if (!note) {
      return res.status(404).json({ message: "Note not found" })
    }
    return res.json({
      success: true,
      data: note
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateNote = async (req, res) => {
  try {
    const userId = req.user.id
    const noteId = req.params.id
    const { title, content } = req.body

    const success = await noteModel.updateNote(noteId, userId, title, content)
    if (!success) {
      return res.status(404).json({ message: "Note not found or unauthorized" })
    }

    return res.json({
      success: true,
      message: "Note updated successfully"
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteNote = async (req, res) => {
  try {
    if (req.user.userCategory !== 1) {
      return res.status(403).json({ success: false, message: "You don't have the privilege to delete notes." })
    }

    const userId = req.user.id
    const noteId = req.params.id

    const success = await noteModel.deleteNote(noteId, userId)
    if (!success) {
      return res.status(404).json({ message: "Note not found or unauthorized" })
    }

    return res.json({
      success: true,
      message: "Note deleted successfully"
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getPlaceholders = async (req, res) => {
  try {
    const userId = req.query.userId

    const result = await axios.get(
      'https://jsonplaceholder.typicode.com/posts',
      { params: { userId } }
    )

    const modifiedPosts = result.data.map(post => ({
      ...post,
      isPopular: post.id % 2 === 0,
      fetchedAt: new Date(),
      source: "proxy-api"
    }))

    res.json({
      success: true,
      count: modifiedPosts.length,
      data: modifiedPosts
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
const noteModel = require('../models/note');
//const { StatusCodes } = require('http-status-codes');
const getAllNotes = async (req, res) => {
  const notes = await noteModel.find({ createdBy: req.user.id }).sort('CreatedAt');
  res.render('notes', { notes });
};

const addNote = async (req, res) => {
  try {
    const {title, subject, content} = req.body;

    if (!title || !subject || !content) {
      req.flash("error", "Title, subject or content fields cannot be empty.");
      return res.redirect('/notes/new');
    } 

    req.body.createdBy = req.user.id;
    await noteModel.create(req.body);
    req.flash("info", "The note has been successfully added.")
  } catch (err) {
    req.flash("error", "Undefined error.")
  }
  res.redirect('/notes');
};

const editForm = async (req, res) => {
  const note = await noteModel.findOne({
    _id: req.params.id,
    createdBy: req.user.id,
  });

  if (!note) {
    req.flash("error", `No note with id ${req.params.id}`);
    return res.redirect('/notes');
  }
  res.render('note', { note });
};

const editNote = async (req, res) => {
  const {
    body: { title, subject, content },
    user: { id: userId },
    params: { id: noteId },
  } = req;

  if (!title || !subject || !content) {
    req.flash('error', "You must include the title, subject and content.");
    return res.redirect(`/notes/edit/${noteId}`);
  }

  const note = await noteModel.findOneAndUpdate(
    {
      _id: noteId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!note) {
    req.flash("error", `No note with id ${noteId} found.`)
  } else {
    req.flash("info", "The note has been successfully updated.")
  }
  res.redirect('/notes');
};

const deleteNote = async (req, res) => {
  const {
    user: { id: userId },
    params: { id: noteId },
  } = req;

  const note = await noteModel.findOneAndDelete({
    _id: noteId,
    createdBy: userId,
  });

  //const info = [`The note has been successfully deleted.`];

  if (!note) {
    req.flash("error",`No note with id ${noteId} found`);
  } else {
    req.flash("info", "The note has been successfully deleted.");
  }

  res.redirect('/notes');
};

module.exports = {
  getAllNotes,
  addNote,
  //addForm,
  editForm,
  editNote,
  deleteNote,
};
const note = require('../models/note');
const { StatusCodes } = require('http-status-codes');
const parseVErr = require('../utils/parseValidationErr');

const getAllNotes = async (req, res) => {
  const notes = await note.find({ createdBy: req.user.id }).sort('CreatedAt');
  res.status(StatusCodes.OK).render('notes', { notes });
};

const addNote = async (req, res) => {
  req.body.createdBy = req.user.id;
  await note.create(req.body);
  res.status(StatusCodes.CREATED);

  const notes = await note.find({ createdBy: req.user.id }).sort('CreatedAt');
  const info = [`The note has been successfully added.`];
  res.render('notes', { notes, info });
};

const addForm = async (req, res) => {
  res.render('note', { note: null });
};

const editForm = async (req, res) => {
  const note = await note.findOne({
    _id: req.params.id,
    createdBy: req.user.id,
  });

  if (!note) {
    throw new Error(`No note with id ${req.params.id}`);
  }
  res.status(StatusCodes.OK).render('note', { note });
};

const editNote = async (req, res) => {
  const {
    body: { title, subject, content },
    user: { id: userId },
    params: { id: noteId },
  } = req;

  if (title === '' || subject === '') {
    const info = ['You must include the title and subject.'];
    const note = await note.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    return res.render('note', { note, info });
  }

  const note = await note.findOneAndUpdate(
    {
      _id: noteId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidators: true }
  );
  const info = [`The note has been successfully updated.`];

  if (!note) {
    throw new Error(`No note with id ${noteId} found.`);
  }

  const notes = await note.find({ createdBy: userId }).sort('CreatedAt');
  res.render('notes', { notes, info });
};

const deleteNote = async (req, res) => {
  const {
    user: { id: userId },
    params: { id: noteId },
  } = req;

  const note = await note.findOneAndDelete({
    _id: noteId,
    createdBy: userId,
  });

  const info = [`The note has been successfully deleted.`];

  if (!note) {
    throw new Error(`No note with id ${noteId} found`);
  }

  const notes = await note.find({ createdBy: userId }).sort('CreatedAt');
  res.render('notes', { notes, info });
};

module.exports = {
  getAllNotes,
  addNote,
  addForm,
  editForm,
  editNote,
  deleteNote,
};
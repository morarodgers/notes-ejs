const express = require('express');
const router = express.Router();

const {
  getAllNotes,
  addNote,
  addForm,
  editForm,
  editNote,
  deleteNote,
} = require('../controllers/notes');

router.route('/').get(getAllNotes).post(addNote);
router.route('/new').get(addForm);
router.route('/edit/:id').get(editForm);
router.route('/update/:id').post(editNote);
router.route('/delete/:id').post(deleteNote);

module.exports = router;
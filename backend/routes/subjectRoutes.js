import express from 'express';
import {
	deleteSubject,
	getAllSubjects,
	getSubjectById,
	createSubject,
	updateSubject,
	createSubjectReview,
	getTopSubjects,
	getSearchForSubjects,
} from '../controllers/subjectControllers.js';
import { protectRoute, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc fetch all the subjects, create a subject
// @route GET /api/subjects
// @access PUBLIC
router
	.route('/')
	.get(getAllSubjects)
	.get(getSearchForSubjects)
	.post(createSubject);

// @desc fetch top rated subjects
// @route GET /api/subjects/top
// @access PUBLIC
router.route('/top').get(getTopSubjects);

// @desc Fetch a single subject by id, Delete a subject, update a subject
// @route GET /api/subjects/:id
// @access PUBLIC & PRIVATE/ADMIN
router
	.route('/:id')
	.get(protectRoute, isAdmin, getSubjectById)
	.delete(protectRoute, isAdmin, deleteSubject)
	.put(protectRoute, isAdmin, updateSubject);

// @desc Create a subject review
// @route POST /api/subjects/:id/reviews
// @access PRIVATE
router.route('/:id/reviews').post(protectRoute, createSubjectReview);

export default router;

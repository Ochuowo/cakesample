import express from 'express';
import {
	deleteLesson,
	getAllLessons,
	getLessonById,
	createLesson,
	updateLesson,
	createLessonReview,
	getTopLessons,
	getSearchForLessons,
} from '../controllers/lessonControllers.js';
import { protectRoute, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc fetch all the lessons, create a lesson
// @route GET /api/lessons
// @access PUBLIC
router
	.route('/')
	.get(getAllLessons)
	.post(protectRoute, isAdmin, createLesson);

// @desc fetch top rated lessons
// @route GET /api/lessons/top
// @access PUBLIC
router.route('/top').get(getTopLessons);

// @desc Fetch a single lesson by id, Delete a lesson, update a lesson
// @route GET /api/lessons/:id
// @access PUBLIC & PRIVATE/ADMIN
router
	.route('/:id')
	.get(getSearchForLessons)
	.get(getLessonById)
	.delete(protectRoute, isAdmin, deleteLesson)
	.put(protectRoute, isAdmin, updateLesson);

// @desc Create a lesson review
// @route POST /api/lessons/:id/reviews
// @access PRIVATE
router.route('/:id/reviews').post(protectRoute, createLessonReview);

export default router;

import express from 'express';
import {
	authTeacher,
	getTeacherProfile,
	getTeacherData,
	getAccessToken,
	registerTeacher,
	confirmTeacher,
	mailForEmailVerification,
	mailForPasswordReset,
	resetTeacherPassword,
	updateTeacherProfile,
	getAllTeachers,
	deleteTeacher,
	getTeacherById,
	updateTeacher,
	getSearchForTeachers,
} from '../controllers/teacherControllers.js';
import { protectRoute, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc register a new teacher & get all teachers if admin
// @route POST /api/teachers/
// @access PUBLIC || PRIVATE?ADMIN
router.route('/')
.get(getAllTeachers)
.get(getSearchForTeachers)
.post(protectRoute, isAdmin, registerTeacher);

// @desc authenticate teacher and get token
// @route POST /api/teachers/login
// @access PUBLIC
router.route('/login').post(authTeacher);

// @desc confirm the email address of the registered teacher
// @route GET /api/teachers/confirm
// @access PUBLIC
router.route('/confirm/:token').get(confirmTeacher);

// @desc send a mail with the link to verify mail, to be used if the teacher forgot to verify mail after registration
// @route POST /api/teachers/confirm
// @access PUBLIC
router.route('/confirm').post(mailForEmailVerification);

// @desc send a mail with the link to reset password
// @route POST /api/teachers/reset
// and
// @desc reset password of any verified teacher
// @route PUT /api/teachers/reset

// @access PUBLIC
router.route('/reset').post(mailForPasswordReset).put(resetTeacherPassword);

// @desc obtain new access tokens using the refresh tokens
// @route GET /api/teachers/refresh
// @access PUBLIC
router.route('/refresh').post(getAccessToken);

// @desc get data for an authenticated teacher, and update data for an authenticated teacher
// @route PUT & GET /api/teachers/profile
// @access PRIVATE
router
	.route('/profile')
	.get(protectRoute, getTeacherProfile)
	.put(protectRoute, updateTeacherProfile);

// @desc get teacher data for google login in the frontend
// @route POST /api/teachers/passport/data
// @access PUBLIC
router.route('/passport/data').post(getTeacherData);

// @desc Delete a teacher, get a teacher by id, update the teacher
// @route DELETE /api/teachers/:id
// @access PRIVATE/ADMIN
router
	.route('/:id')
	.delete(protectRoute, isAdmin, deleteTeacher)
	.get(protectRoute, isAdmin, getTeacherById)
	.put(protectRoute, isAdmin, updateTeacher);

export default router;

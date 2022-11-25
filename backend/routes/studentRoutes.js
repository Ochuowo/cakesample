import express from 'express';
import {
	authStudent,
	getStudentProfile,
	getStudentData,
	getAccessToken,
	registerStudent,
	confirmStudent,
	mailForEmailVerification,
	mailForPasswordReset,
	resetStudentPassword,
	updateStudentProfile,
	getAllStudents,
	deleteStudent,
	getStudentById,
	updateStudent,
	getSearchForStudents,
	getSearchForStudentsInClass,
	getSearchForSubjects,
} from '../controllers/studentControllers.js';
import { protectRoute, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc register a new student & get all students if admin
// @route POST /api/students
// @access PUBLIC || PRIVATE?ADMIN
router.route('/')
.get(getAllStudents)
.get(getSearchForStudents)
.get(getSearchForStudentsInClass)
.get(getSearchForSubjects)
.post(protectRoute, isAdmin, registerStudent);

// @desc authenticate student and get token
// @route POST /api/students/login
// @access PUBLIC
router.route('/login').post(authStudent);

// @desc confirm the email address of the registered student
// @route GET /api/students/confirm
// @access PUBLIC
router.route('/confirm/:token').get(confirmStudent);

// @desc send a mail with the link to verify mail, to be used if the student forgot to verify mail after registration
// @route POST /api/students/confirm
// @access PUBLIC
router.route('/confirm').post(mailForEmailVerification);

// @desc send a mail with the link to reset password
// @route POST /api/students/reset
// and
// @desc reset password of any verified student
// @route PUT /api/students/reset

// @access PUBLIC
router.route('/reset').post(mailForPasswordReset).put(resetStudentPassword);

// @desc obtain new access tokens using the refresh tokens
// @route GET /api/students/refresh
// @access PUBLIC
router.route('/refresh').post(getAccessToken);

// @desc get data for an authenticated student, and update data for an authenticated student
// @route PUT & GET /api/students/profile
// @access PRIVATE
router
	.route('/profile')
	.get(protectRoute, getStudentProfile)
	.put(protectRoute, updateStudentProfile);

// @desc get student data for google login in the frontend
// @route POST /api/students/passport/data
// @access PUBLIC
router.route('/passport/data').post(getStudentData);

// @desc Delete a student, get a student by id, update the student
// @route DELETE /api/students/:id
// @access PRIVATE/ADMIN
router
	.route('/:id')
	.delete(protectRoute, isAdmin, deleteStudent)
	.get(protectRoute, isAdmin, getStudentById)
	.put(protectRoute, isAdmin, updateStudent);

export default router;

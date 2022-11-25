import asyncHandler from 'express-async-handler';
import Teacher from '../models/teacherModel.js';
import Token from '../models/tokenModel.js';
import generateToken from '../utils/generateToken.js';
import sendMail from '../utils/sendMail.js';
import generateGravatar from '../utils/generateGravatar.js';
import jwt from 'jsonwebtoken';

// @desc Get all the teachers info
// @route GET /api/teachers
// @access PRIVATE/ADMIN
const getAllTeachers = asyncHandler(async (req, res) => {
	const page = Number(req.query.pageNumber) || 1; // the current page number in the pagination
	const pageSize = 20; // total number of entries on a single page
	const count = await Teacher.countDocuments({}); // total number of documents available
	// const count = await Order.countDocuments({}); // total number of documents available

	// find all orders that need to be sent for the current page, by skipping the documents included in the previous pages
	// and limiting the number of documents included in this request
	// sort this in desc order that the document was created at
	const allTeachers = await Teacher.find({})
		.limit(pageSize)
		.skip(pageSize * (page - 1))
		.sort('-createdAt');

	// send the list of orders, current page number, total number of pages available
	res.json({
		teachers: allTeachers,
		page,
		pages: Math.ceil(count / pageSize),
		total: count,
	});
});

// @desc Delete a teacher
// @route DELETE /api/teachers/:id
// @access PRIVATE/ADMIN
const deleteTeacher = asyncHandler(async (req, res) => {
	const teacher = await Teacher.findById(req.params.id);
	if (teacher) {
		await teacher.remove();
		res.json({
			message: 'Teacher removed from DB',
		});
	} else {
		res.status(404);
		throw new Error('Teacher not found');
	}
});

// @desc get teacher by ID
// @route GET /api/teachers/:id
// @access PRIVATE/ADMIN
const getTeacherById = asyncHandler(async (req, res) => {
	const teacher = await Teacher.findById(req.params.id).select('-password');
	if (teacher) res.json(teacher);
	else {
		res.status(404);
		throw new Error('Teacher does not exist');
	}
});

// @desc update teacher from the admin panel
// @route PUT /api/teachers/:id
// @access PRIVATE/ADMIN
const updateTeacher = asyncHandler(async (req, res) => {
	// do not include the hashed password when fetching this teacher
	const teacher = await Teacher.findById(req.params.id).select('-password');
	if (teacher) {
		// update whicever field was sent in the rquest body
		teacher.name = req.body.name || teacher.name;
		teacher.isConfirmed = req.body.email === teacher.email;
		teacher.email = req.body.email || teacher.email;
		teacher.isAdmin = req.body.isAdmin;
		const updatedTeacher = await teacher.save();
		if (updatedTeacher) {
			res.json({
				id: updatedTeacher._id,
				email: updatedTeacher.email,
				name: updatedTeacher.name,
				isAdmin: updatedTeacher.isAdmin,
				isConfirmed: updatedTeacher.isConfirmed,
			});
		}
	} else {
		res.status(400);
		throw new Error('Teacher not found.');
	}
});

// @desc authenticate teacher and get token
// @route POST /api/teachers/login
// @access PUBLIC
const authTeacher = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	let teacher = await Teacher.findOne({ email });
	// generate both the access and the refresh tokens
	const accessToken = generateToken(teacher._id, 'access');
	const refreshToken = generateToken(teacher._id, 'refresh');

	// if the passwords are matching, then check if a refresh token exists for this teacher
	if (teacher && (await teacher.matchPassword(password))) {
		const existingToken = await Token.findOne({ email });
		// if no refresh token available, create one and store it in the db
		if (!existingToken) {
			const newToken = await Token.create({
				email,
				token: refreshToken,
			});
		} else {
			existingToken.token = refreshToken;
			existingToken.save();
		}

		res.json({
			id: teacher._id,
			email: teacher.email,
			name: teacher.name,
			isAdmin: teacher.isAdmin,
			isConfirmed: teacher.isConfirmed,
			avatar: teacher.avatar,
			accessToken,
			refreshToken,
		});
	} else {
		res.status(401);
		throw new Error(teacher ? 'Invalid Password' : 'Invalid email');
	}
});

// @desc register a new teacher
// @route POST /api/teachers/
// @access PUBLIC
const registerTeacher = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	const teacherExists = await Teacher.findOne({ email });

	if (teacherExists) {
		res.status(400);
		throw new Error('Email already registered');
	}

	// the gravatar will be unique for each registered email
	const avatar = generateGravatar(email);

	const teacher = await Teacher.create({
		name,
		email,
		password,
		avatar,
	});

	// if teacher was created successfully
	if (teacher) {
		// send a mail for email verification of the newly registred email id
		await sendMail(teacher._id, email, 'email verification');

		const refreshToken = generateToken(teacher._id, 'refresh');
		res.status(201).json({
			id: teacher._id,
			email: teacher.email,
			name: teacher.name,
			avatar,
			isAdmin: teacher.isAdmin,
			isConfirmed: teacher.isConfirmed,
			accessToken: generateToken(teacher._id, 'access'),
			refreshToken,
		});
	} else {
		res.status(400);
		throw new Error('Teacher not created');
	}
});

// @desc send a mail with the link to verify e-mail
// @route POST /api/teachers/confirm
// @access PUBLIC
const mailForEmailVerification = asyncHandler(async (req, res) => {
	try {
		const { email } = req.body;

		const teacher = await Teacher.findOne({ email });
		// console.log(teacher);
		if (teacher) {
			// send a verification email, if this teacher is not a confirmed email
			if (!teacher.isConfirmed) {
				// send the mail
				await sendMail(teacher._id, email, 'email verification');
				res.status(201).json({
					id: teacher._id,
					email: teacher.email,
					name: teacher.name,
					isAdmin: teacher.isAdmin,
					avatar: teacher.avatar,
					isConfirmed: teacher.isConfirmed,
				});
			} else {
				res.status(400);
				throw new Error('Teacher already confirmed');
			}
		}
	} catch (error) {
		console.log(error);
		res.status(401);
		throw new Error('Could not send mail. Please retry.');
	}
});

// @desc send a mail with the link to reset password
// @route POST /api/teachers/reset
// @access PUBLIC
const mailForPasswordReset = asyncHandler(async (req, res) => {
	try {
		const { email } = req.body;

		const teacher = await Teacher.findOne({ email });

		// send a link to reset password only if it's a confirmed account
		if (teacher && teacher.isConfirmed) {
			// send the mail and return the teacher details

			// the sendMail util function takes a 3rd argument to indicate what type of mail to send
			await sendMail(teacher._id, email, 'forgot password');

			res.status(201).json({
				id: teacher._id,
				email: teacher.email,
				name: teacher.name,
				isAdmin: teacher.isAdmin,
				avatar: teacher.avatar,
				isConfirmed: teacher.isConfirmed,
			});
		}
	} catch (error) {
		console.log(error);
		res.status(401);
		throw new Error('Could not send the mail. Please retry.');
	}
});

// @desc reset password of any verified teacher
// @route PUT /api/teachers/reset
// @access PUBLIC
const resetTeacherPassword = asyncHandler(async (req, res) => {
	try {
		// update the teacher password if the jwt is verified successfully
		const { passwordToken, password } = req.body;
		const decodedToken = jwt.verify(
			passwordToken,
			process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET
		);
		const teacher = await Teacher.findById(decodedToken.id);

		if (teacher && password) {
			teacher.password = password;
			const updatedTeacher = await teacher.save();

			if (updatedTeacher) {
				res.status(200).json({
					id: updatedTeacher._id,
					email: updatedTeacher.email,
					name: updatedTeacher.name,
					avatar: updatedTeacher.avatar,
					isAdmin: updatedTeacher.isAdmin,
				});
			} else {
				res.status(401);
				throw new Error('Unable to update password');
			}
		}
	} catch (error) {
		res.status(400);
		throw new Error('Teacher not found.');
	}
});

// @desc confirm the email address of the registered teacher
// @route GET /api/teachers/confirm
// @access PUBLIC
const confirmTeacher = asyncHandler(async (req, res) => {
	try {
		// set the teacher to a confirmed status, once the corresponding JWT is verified correctly
		const emailToken = req.params.token;
		const decodedToken = jwt.verify(
			emailToken,
			process.env.JWT_EMAIL_TOKEN_SECRET
		);
		const teacher = await Teacher.findById(decodedToken.id).select('-password');
		teacher.isConfirmed = true;
		const updatedTeacher = await teacher.save();
		const foundToken = await Token.findOne({ email: updatedTeacher.email }); // send the refresh token that was stored
		res.json({
			id: updatedTeacher._id,
			email: updatedTeacher.email,
			name: updatedTeacher.name,
			isAdmin: updatedTeacher.isAdmin,
			avatar: updatedTeacher.avatar,
			isConfirmed: updatedTeacher.isConfirmed,
			accessToken: generateToken(teacher._id, 'access'),
			refreshToken: foundToken,
		});
	} catch (error) {
		console.log(error);
		res.status(401);
		throw new Error('Not authorised. Token failed');
	}
});

// @desc obtain new access tokens using the refresh tokens
// @route GET /api/teachers/refresh
// @access PUBLIC
const getAccessToken = asyncHandler(async (req, res) => {
	const refreshToken = req.body.token;
	const email = req.body.email;

	// search if currently loggedin teacher has the refreshToken sent
	const currentAccessToken = await Token.findOne({ email });

	if (!refreshToken || refreshToken !== currentAccessToken.token) {
		res.status(400);
		throw new Error('Refresh token not found, login again');
	}

	// If the refresh token is valid, create a new accessToken and return it.
	jwt.verify(
		refreshToken,
		process.env.JWT_REFRESH_TOKEN_SECRET,
		(err, teacher) => {
			if (!err) {
				const accessToken = generateToken(teacher.id, 'access');
				return res.json({ success: true, accessToken });
			} else {
				return res.json({
					success: false,
					message: 'Invalid refresh token',
				});
			}
		}
	);
});

// @desc get teacher data for google login in the frontend
// @route POST /api/teachers/passport/data
// @access PUBLIC
const getTeacherData = asyncHandler(async (req, res) => {
	const { id } = req.body;
	const teacher = await Teacher.findById(id);
	if (teacher) {
		res.json({
			id: teacher._id,
			email: teacher.email,
			name: teacher.name,
			avatar: teacher.avatar,
			isAdmin: teacher.isAdmin,
			isConfirmed: teacher.isConfirmed,
		});
	} else {
		res.status(400);
		throw new Error('Teacher not authorised to view this page');
	}
});

// @desc get data for an authenticated teacher
// @route GET /api/teachers/profile
// @access PRIVATE
const getTeacherProfile = asyncHandler(async (req, res) => {
	const teacher = await Teacher.findById(req.teacher.id);
	if (teacher) {
		res.json({
			id: teacher._id,
			email: teacher.email,
			avatar: teacher.avatar,
			name: teacher.name,
			isAdmin: teacher.isAdmin,
		});
	} else {
		res.status(400);
		throw new Error('Teacher not authorised to view this page');
	}
});

// @desc update data for an authenticated teacher
// @route PUT /api/teachers/profile
// @access PRIVATE
const updateTeacherProfile = asyncHandler(async (req, res) => {
	const teacher = await Teacher.findById(req.teacher.id);
	if (teacher) {
		// update whichever field is sent in the req body
		teacher.name = req.body.name || teacher.name;
		teacher.avatar = req.body.avatar || teacher.avatar;
		if (req.body.email) teacher.isConfirmed = req.body.email === teacher.email;
		teacher.email = req.body.email || teacher.email;
		if (req.body.password) {
			teacher.password = req.body.password;
		}

		const updatedTeacher = await teacher.save();

		// check if the current teacher logged in is with a social account, in which case do not create/find any access or refresh tokens
		const isSocialLogin =
			updatedTeacher.googleID ||
			updatedTeacher.facebookID ||
			updatedTeacher.githubID ||
			updatedTeacher.twitterID;

		let updatedTeacherObj = {
			id: updatedTeacher._id,
			email: updatedTeacher.email,
			name: updatedTeacher.name,
			avatar: updatedTeacher.avatar,
			isAdmin: updatedTeacher.isAdmin,
			isConfirmed: updatedTeacher.isConfirmed,
		};

		if (updatedTeacher) {
			if (!isSocialLogin) {
				const refreshToken = generateToken(updatedTeacher._id, 'refresh');
				const existingToken = await Token.findOne({
					email: updatedTeacher.email,
				});
				// store a new refresh token for this email
				if (existingToken) {
					existingToken.token = refreshToken;
					existingToken.save();
				} else {
					Token.create({
						teacher: updatedTeacher._id,
						token: refreshToken,
					});
				}
				// add these two token to the response
				updatedTeacherObj = {
					...updatedTeacherObj,
					accessToken: generateToken(updatedTeacher._id, 'access'),
					refreshToken,
				};
			}
			res.json(updatedTeacherObj);
		}
	} else {
		res.status(400);
		throw new Error('Teacher not found.');
	}
});

// ___________________________________Search Controllers______________________________

const getSearchForTeachers = async (req, res, next) => {
	const searchText = req.params.text;
	try {
		const teachers = await Teacher.searchForTeacher(searchText);
		res.status(200).json({ teachers: teachers });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

export {
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
};

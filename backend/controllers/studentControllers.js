import asyncHandler from 'express-async-handler';
import Student from '../models/studentModel.js';
import Token from '../models/tokenModel.js';
import generateToken from '../utils/generateToken.js';
import sendMail from '../utils/sendMail.js';
import generateGravatar from '../utils/generateGravatar.js';
import jwt from 'jsonwebtoken';

// @desc Get all the students info
// @route GET /api/students
// @access PRIVATE/ADMIN
const getAllStudents = asyncHandler(async (req, res) => {
	const page = Number(req.query.pageNumber) || 1; // the current page number in the pagination
	const pageSize = 20; // total number of entries on a single page
	const count = await Student.countDocuments({}); // total number of documents available
	// const count = await Order.countDocuments({}); // total number of documents available

	// find all orders that need to be sent for the current page, by skipping the documents included in the previous pages
	// and limiting the number of documents included in this request
	// sort this in desc order that the document was created at
	const allStudents = await Student.find({})
		.limit(pageSize)
		.skip(pageSize * (page - 1))
		.sort('-createdAt');

	// send the list of orders, current page number, total number of pages available
	res.json({
		students: allStudents,
		page,
		pages: Math.ceil(count / pageSize),
		total: count,
	});
});

// @desc Delete a student
// @route DELETE /api/students/:id
// @access PRIVATE/ADMIN
const deleteStudent = asyncHandler(async (req, res) => {
	const student = await Student.findById(req.params.id);
	if (student) {
		await student.remove();
		res.json({
			message: 'Student removed from DB',
		});
	} else {
		res.status(404);
		throw new Error('Student not found');
	}
});

// @desc get student by ID
// @route GET /api/students/:id
// @access PRIVATE/ADMIN
const getStudentById = asyncHandler(async (req, res) => {
	const student = await Student.findById(req.params.id).select('-password');
	if (student) res.json(student);
	else {
		res.status(404);
		throw new Error('Student does not exist');
	}
});

// @desc update student from the admin panel
// @route PUT /api/students/:id
// @access PRIVATE/ADMIN
const updateStudent = asyncHandler(async (req, res) => {
	// do not include the hashed password when fetching this student
	const student = await Student.findById(req.params.id).select('-password');
	if (student) {
		// update whichever field was sent in the request body
		student.firstName = req.body.firstName || student.firstName;
		student.lastName = req.body.lastName || student.lastName;
		student.isConfirmed = req.body.email === student.email;
		student.email = req.body.email || student.email;
		student.age = req.body.age || student.age;
		student.gender = req.body.gender || student.gender;
		student.avatar = req.body.avatar || student.avatar;
		const updatedStudent = await student.save();
		if (updatedStudent) {
			res.json({
				id: updatedStudent._id,
				email: updatedStudent.email,
				firstName: updatedStudent.firstName,
				lastName: updatedStudentlastNname,
				isConfirmed: updatedStudent.isConfirmed,
				age: updatedStudent.age,
				gender: updatedStudent.gender,
				avatar: updatedStudent.avatar,
			});
		}
	} else {
		res.status(400);
		throw new Error('Student not found.');
	}
});

// @desc authenticate student and get token
// @route POST /api/students/login
// @access PUBLIC
const authStudent = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	let student = await Student.findOne({ email });
	// generate both the access and the refresh tokens
	const accessToken = generateToken(student._id, 'access');
	const refreshToken = generateToken(student._id, 'refresh');

	// if the passwords are matching, then check if a refresh token exists for this student
	if (student && (await student.matchPassword(password))) {
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
			id: student._id,
			email: student.email,
			firstName: student.firstName,
			lastName: student.lastName,
			isConfirmed: student.isConfirmed,
			age: student.age,
			gender: student.gender,
			avatar: student.avatar,
			accessToken,
			refreshToken,
		});
	} else {
		res.status(401);
		throw new Error(student ? 'Invalid Password' : 'Invalid email');
	}
});

// @desc register a new student
// @route POST /api/students/
// @access PUBLIC
const registerStudent = asyncHandler(async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	const studentExists = await Student.findOne({ email });

	if (studentExists) {
		res.status(400);
		throw new Error('Email already registered');
	}

	// the gravatar will be unique for each registered email
	const avatar = generateGravatar(email);

	const student = await Student.create({
		firstName,
		lastName,
		email,
		password,
		avatar,
	});

	// if student was created successfully
	if (student) {
		// send a mail for email verification of the newly registred email id
		await sendMail(student._id, email, 'email verification');

		const refreshToken = generateToken(student._id, 'refresh');
		res.status(201).json({
			id: student._id,
			email: student.email,
			firstName: student.firstName,
			lastName: student.lastName,
			avatar,
			isConfirmed: student.isConfirmed,
			accessToken: generateToken(student._id, 'access'),
			refreshToken,
		});
	} else {
		res.status(400);
		throw new Error('Student not created');
	}
});

// @desc send a mail with the link to verify e-mail
// @route POST /api/students/confirm
// @access PUBLIC
const mailForEmailVerification = asyncHandler(async (req, res) => {
	try {
		const { email } = req.body;

		const student = await Student.findOne({ email });
		// console.log(student);
		if (student) {
			// send a verification email, if this student is not a confirmed email
			if (!student.isConfirmed) {
				// send the mail
				await sendMail(student._id, email, 'email verification');
				res.status(201).json({
					id: student._id,
					email: student.email,
					firstName: student.firstName,
					lastName: student.lastName,
					avatar: student.avatar,
					isConfirmed: student.isConfirmed,
				});
			} else {
				res.status(400);
				throw new Error('Student already confirmed');
			}
		}
	} catch (error) {
		console.log(error);
		res.status(401);
		throw new Error('Could not send mail. Please retry.');
	}
});

// @desc send a mail with the link to reset password
// @route POST /api/students/reset
// @access PUBLIC
const mailForPasswordReset = asyncHandler(async (req, res) => {
	try {
		const { email } = req.body;

		const student = await Student.findOne({ email });

		// send a link to reset password only if it's a confirmed account
		if (student && student.isConfirmed) {
			// send the mail and return the student details

			// the sendMail util function takes a 3rd argument to indicate what type of mail to send
			await sendMail(student._id, email, 'forgot password');

			res.status(201).json({
				id: student._id,
				email: student.email,
				firstName: student.firstName,
				lastName: student.lastName,
				avatar: student.avatar,
				isConfirmed: student.isConfirmed,
			});
		}
	} catch (error) {
		console.log(error);
		res.status(401);
		throw new Error('Could not send the mail. Please retry.');
	}
});

// @desc reset password of any verified student
// @route PUT /api/students/reset
// @access PUBLIC
const resetStudentPassword = asyncHandler(async (req, res) => {
	try {
		// update the student password if the jwt is verified successfully
		const { passwordToken, password } = req.body;
		const decodedToken = jwt.verify(
			passwordToken,
			process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET
		);
		const student = await Student.findById(decodedToken.id);

		if (student && password) {
			student.password = password;
			const updatedStudent = await student.save();

			if (updatedStudent) {
				res.status(200).json({
					id: updatedStudent._id,
					email: updatedStudent.email,
					firstName: updatedStudent.firstName,
					lastName: updatedStudent.lastName,
					avatar: updatedStudent.avatar,
				});
			} else {
				res.status(401);
				throw new Error('Unable to update password');
			}
		}
	} catch (error) {
		res.status(400);
		throw new Error('Student not found.');
	}
});

// @desc confirm the email address of the registered student
// @route GET /api/students/confirm
// @access PUBLIC
const confirmStudent = asyncHandler(async (req, res) => {
	try {
		// set the student to a confirmed status, once the corresponding JWT is verified correctly
		const emailToken = req.params.token;
		const decodedToken = jwt.verify(
			emailToken,
			process.env.JWT_EMAIL_TOKEN_SECRET
		);
		const student = await Student.findById(decodedToken.id).select('-password');
		student.isConfirmed = true;
		const updatedStudent = await student.save();
		const foundToken = await Token.findOne({ email: updatedStudent.email }); // send the refresh token that was stored
		res.json({
			id: updatedStudent._id,
			email: updatedStudent.email,
			firstName: updatedStudent.firstName,
			lastName: updatedStudent.lastName,
			avatar: updatedStudent.avatar,
			isConfirmed: updatedStudent.isConfirmed,
			accessToken: generateToken(student._id, 'access'),
			refreshToken: foundToken,
		});
	} catch (error) {
		console.log(error);
		res.status(401);
		throw new Error('Not authorised. Token failed');
	}
});

// @desc obtain new access tokens using the refresh tokens
// @route GET /api/students/refresh
// @access PUBLIC
const getAccessToken = asyncHandler(async (req, res) => {
	const refreshToken = req.body.token;
	const email = req.body.email;

	// search if currently loggedin student has the refreshToken sent
	const currentAccessToken = await Token.findOne({ email });

	if (!refreshToken || refreshToken !== currentAccessToken.token) {
		res.status(400);
		throw new Error('Refresh token not found, login again');
	}

	// If the refresh token is valid, create a new accessToken and return it.
	jwt.verify(
		refreshToken,
		process.env.JWT_REFRESH_TOKEN_SECRET,
		(err, student) => {
			if (!err) {
				const accessToken = generateToken(student.id, 'access');
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

// @desc get student data for google login in the frontend
// @route POST /api/students/passport/data
// @access PUBLIC
const getStudentData = asyncHandler(async (req, res) => {
	const { id } = req.body;
	const student = await Student.findById(id);
	if (student) {
		res.json({
			id: student._id,
			email: student.email,
			firstName: student.firstName,
			lastName: student.lastName,
			avatar: student.avatar,
			isConfirmed: student.isConfirmed,
		});
	} else {
		res.status(400);
		throw new Error('Student not authorised to view this page');
	}
});

// @desc get data for an authenticated student
// @route GET /api/students/profile
// @access PRIVATE
const getStudentProfile = asyncHandler(async (req, res) => {
	const student = await Student.findById(req.student.id);
	if (student) {
		res.json({
			id: student._id,
			email: student.email,
			avatar: student.avatar,
			firstName: student.firstName,
			lastName: student.lastName,
		});
	} else {
		res.status(400);
		throw new Error('Student not authorised to view this page');
	}
});

// @desc update data for an authenticated student
// @route PUT /api/students/profile
// @access PRIVATE
const updateStudentProfile = asyncHandler(async (req, res) => {
	const student = await Student.findById(req.student.id);
	if (student) {
		// update whichever field is sent in the req body
		student.firstName = req.body.firstName || student.firstName;
		student.lastName = req.body.lastName || student.lastName;
		student.avatar = req.body.avatar || student.avatar;
		if (req.body.email) student.isConfirmed = req.body.email === student.email;
		student.email = req.body.email || student.email;
		if (req.body.password) {
			student.password = req.body.password;
		}

		const updatedStudent = await student.save();

		// check if the current student logged in is with a social account, in which case do not create/find any access or refresh tokens
		const isSocialLogin =
			updatedStudent.googleID ||
			updatedStudent.facebookID ||
			updatedStudent.githubID ||
			updatedStudent.twitterID;

		let updatedStudentObj = {
			id: updatedStudent._id,
			email: updatedStudent.email,
			firstName: updatedStudent.firstName,
			lastName: updatedStudent.lastName,
			avatar: updatedStudent.avatar,
			isConfirmed: updatedStudent.isConfirmed,
		};

		if (updatedStudent) {
			if (!isSocialLogin) {
				const refreshToken = generateToken(updatedStudent._id, 'refresh');
				const existingToken = await Token.findOne({
					email: updatedStudent.email,
				});
				// store a new refresh token for this email
				if (existingToken) {
					existingToken.token = refreshToken;
					existingToken.save();
				} else {
					Token.create({
						student: updatedStudent._id,
						token: refreshToken,
					});
				}
				// add these two token to the response
				updatedStudentObj = {
					...updatedStudentObj,
					accessToken: generateToken(updatedStudent._id, 'access'),
					refreshToken,
				};
			}
			res.json(updatedStudentObj);
		}
	} else {
		res.status(400);
		throw new Error('Student not found.');
	}
});

// ___________________________________Search Controllers______________________________


const getSearchForStudents = async (req, res, next) => {
	const searchText = req.params.text;

	try {
		const foundStudents = await Student.searchForStudents(searchText);
		res.status(200).json({ students: foundStudents });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

const getSearchForStudentsInClass = async (req, res, next) => {
	const { searchText, lessonId } = req.query;

	try {
		// check if the class exist(not fake)
		const foundClass = await Class.getClass(lessonId);
		if (!foundClass) {
			const error = new Error('This class does not exist');
			error.statusCode = 404;
			throw error;
		}

		const foundStudents = await Student.searchForStudentsInClass(searchText, lessonId);
		res.status(200).json({ students: foundStudents });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

const getSearchForSubjects = async (req, res, next) => {
	const searchText = req.params.text;
	try {
		const subjects = await Subject.GetSearchForSubjects(searchText);
		res.status(200).json({ subjects: subjects });
	} catch (error) {
		error.statusCode = 500;
		next(error);
	}
};

export {
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
};

import asyncHandler from 'express-async-handler';
import Subjects from '../models/subjectModel.js';

// @desc fetch all the subjects
// @route GET /api/subjects
// @access PUBLIC
const getAllSubjects = asyncHandler(async (req, res) => {
	const page = Number(req.query.pageNumber) || 1; // the current page number being fetched
	const pageSize = Number(req.query.pageSize) || 10; // the total number of entries on a single page

	// match all subjects which include the string of chars in the keyword, not necessarily in the given order
	const keyword = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword,
					$options: 'si',
				},
		  }
		: {};
	const count = await Subjects.countDocuments({ ...keyword }); // total number of subjects which match with the given key

	// find all subjects that need to be sent for the current page, by skipping the documents included in the previous pages
	// and limiting the number of documents included in this request
	const subjects = await Subjects.find({ ...keyword })
		.limit(pageSize)
		.skip(pageSize * (page - 1));

	// send the list of subjects, current page number, total number of pages available
	res.json({ subjects, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch a single subject by id
// @route GET /api/subjects/:id
// @access PUBLIC
const getSubjectById = asyncHandler(async (req, res) => {
	const subject = await Subjects.findById(req.params.id);
	if (subject) res.json(subject);
	else {
		// throw a custom error so that our error middleware can catch them and return apt json
		res.status(404);
		throw new Error('Subject not found');
	}
});

// @desc Delete a subject
// @route DELETE /api/subjects/:id
// @access PRIVATE/ADMIN
const deleteSubject = asyncHandler(async (req, res) => {
	const subject = await Subjects.findById(req.params.id);
	if (subject) {
		await subject.remove();
		res.json({ message: 'Subject removed from DB' });
	} else {
		// throw a custom error so that our error middleware can catch them and return apt json
		res.status(404);
		throw new Error('Subject not found');
	}
});

// @desc Create a subject
// @route POST /api/subjects/
// @access PRIVATE/ADMIN
const createSubject = asyncHandler(async (req, res) => {
	// create a dummy subject which can be edited later
	const subject = new Subjects({
		name: 'Sample',
		description:
			'Here is where we separate the boys from men, the girls from Women. Professional classes are for those who wish to be above the rest. Is it you, number one?',
		price: 40000,
		studentsInClass: 9,
		rating: 7.0,
		numReviews: 21,
	});
	const createdSubject = await subject.save();
	res.status(201).json(createdSubject);
});

// @desc Update a subject
// @route PUT /api/subjects/:id
// @access PRIVATE/ADMIN
const updateSubject = asyncHandler(async (req, res) => {
	const {
		name,
		description,
		price,
		studentsInClass,
		rating,
		numReviews,
	} = req.body;
	we
	const subject = await Subjects.findById(req.params.id);

	// update the fields which are sent with the payload
	if (subject) {
		if (name) subject.name = name;
		if (description) subject.description = description;
		if (studentsInClass) subject.studentsInClass = studentsInClass;
		if (rating) subject.rating = rating;
		if (numReviews) subject.numReviews = numReviews;

		const updatedSubject = await subject.save();
		if (updatedSubject) res.status(201).json(updatedSubject);
	} else {
		res.status(404);
		throw new Error('Subject not available');
	}
});

// @desc Create a subject review
// @route POST /api/subjects/:id/reviews
// @access PRIVATE
const createSubjectReview = asyncHandler(async (req, res) => {
	const { rating, review } = req.body;
	const subject = await Subjects.findById(req.params.id);
	if (subject) {
		// If the user has already reviewed this subject, throw an error
		const reviewedAlready = subject.reviews.find(
			(rev) => rev.user.toString() === req.user._id.toString()
		);
		if (reviewedAlready) {
			res.status(400);
			throw new Error('Subject Already Reviewed');
		}

		const newReview = {
			name: req.user.name,
			user: req.user._id,
			avatar: req.user.avatar,
			rating: Number(rating),
			review,
		};

		// store the new review and update the rating of this subject
		subject.reviews.push(newReview);
		subject.numReviews = subject.reviews.length;
		subject.rating =
			subject.reviews.reduce((acc, ele) => acc + ele.rating, 0) /
			subject.numReviews;
		const updatedSubject = await subject.save();
		if (updatedSubject) res.status(201).json({ message: 'Review Added' });
	} else {
		res.status(404);
		throw new Error('Subject not available');
	}
});

// @desc fetch top rated subjects
// @route GET /api/subjects/top
// @access PUBLIC
const getTopSubjects = asyncHandler(async (req, res) => {
	// get top 4 rated subjects
	const topSubjects = await Subjects.find({}).sort({ rating: -1 }).limit(4);
	res.json(topSubjects);
});

// ___________________________________Search Controllers______________________________

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
	getSubjectById,
	getAllSubjects,
	deleteSubject,
	createSubject,
	updateSubject,
	createSubjectReview,
	getTopSubjects,
	getSearchForSubjects,
};

import asyncHandler from 'express-async-handler';
import Lesson from '../models/lessonModel.js';

// @desc fetch all the lessons
// @route GET /api/lessons
// @access PUBLIC
const getAllLessons = asyncHandler(async (req, res) => {
	const page = Number(req.query.pageNumber) || 1; // the current page number being fetched
	const pageSize = Number(req.query.pageSize) || 10; // the total number of entries on a single page

	// match all lessons which include the string of chars in the keyword, not necessarily in the given order
	const keyword = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword,
					$options: 'si',
				},
		  }
		: {};
	const count = await Lesson.countDocuments({ ...keyword }); // total number of lessons which match with the given key

	// find all lessons that need to be sent for the current page, by skipping the documents included in the previous pages
	// and limiting the number of documents included in this request
	const lessons = await Lesson.find({ ...keyword })
		.limit(pageSize)
		.skip(pageSize * (page - 1));

	// send the list of lessons, current page number, total number of pages available
	res.json({ lessons, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch a single lesson by id
// @route GET /api/lessons/:id
// @access PUBLIC
const getLessonById = asyncHandler(async (req, res) => {
	const lesson = await Lesson.findById(req.params.id);
	if (lesson) res.json(lesson);
	else {
		// throw a custom error so that our error middleware can catch them and return apt json
		res.status(404);
		throw new Error('Lesson not found');
	}
});

// @desc Delete a lesson
// @route DELETE /api/lessons/:id
// @access PRIVATE/ADMIN
const deleteLesson = asyncHandler(async (req, res) => {
	const lesson = await Lesson.findById(req.params.id);
	if (lesson) {
		await lesson.remove();
		res.json({ message: 'Lesson removed from DB' });
	} else {
		// throw a custom error so that our error middleware can catch them and return apt json
		res.status(404);
		throw new Error('Lesson not found');
	}
});

// @desc Create a lesson
// @route POST /api/lessons/
// @access PRIVATE/ADMIN
const createLesson = asyncHandler(async (req, res) => {
	// create a dummy lesson which can be edited later
	const lesson = new Lesson({
		name: 'Sample',
		description:
			'Here is where we separate the ranks. Professional lessons are for those who wish to be above the rest. Is it you, number one?',
		price: 40000,
		studentsInLesson: 0,
		rating: 7.0,
		numReviews: 21,
	});
	const createdLesson = await lesson.save();
	res.status(201).json(createdLesson);
});

// @desc Update a lesson
// @route PUT /api/lessons/:id
// @access PRIVATE/ADMIN
const updateLesson = asyncHandler(async (req, res) => {
	const {
		name,
		description,
		price,
		studentsInLesson,
		rating,
		numReviews,
	} = req.body;
	we
	const lesson = await Lesson.findById(req.params.id);

	// update the fields which are sent with the payload
	if (lesson) {
		if (name) lesson.name = name;
		if (description) lesson.description = description;
		if (price) lesson.price = price;
		if (studentsInLesson) lesson.studentsInLesson = studentsInLesson;
		if (rating) lesson.rating = rating;
		if (numReviews) lesson.numReviews = numReviews;

		const updatedLesson = await lesson.save();
		if (updatedLesson) res.status(201).json(updatedLesson);
	} else {
		res.status(404);
		throw new Error('Lesson not available');
	}
});

// @desc Create a lesson review
// @route POST /api/lessons/:id/reviews
// @access PRIVATE
const createLessonReview = asyncHandler(async (req, res) => {
	const { rating, review } = req.body;
	const lesson = await Lesson.findById(req.params.id);
	if (lesson) {
		// If the user has already reviewed this lesson, throw an error
		const reviewedAlready = lesson.reviews.find(
			(rev) => rev.user.toString() === req.user._id.toString()
		);
		if (reviewedAlready) {
			res.status(400);
			throw new Error('Lesson Already Reviewed');
		}

		const newReview = {
			name: req.user.name,
			user: req.user._id,
			avatar: req.user.avatar,
			rating: Number(rating),
			review,
		};

		// store the new review and update the rating of this lesson
		lesson.reviews.push(newReview);
		lesson.numReviews = lesson.reviews.length;
		lesson.rating =
			lesson.reviews.reduce((acc, ele) => acc + ele.rating, 0) /
			lesson.numReviews;
		const updatedLesson = await lesson.save();
		if (updatedLesson) res.status(201).json({ message: 'Review Added' });
	} else {
		res.status(404);
		throw new Error('Lesson not available');
	}
});

// @desc fetch top rated lessons
// @route GET /api/lessons/top
// @access PUBLIC
const getTopLessons = asyncHandler(async (req, res) => {
	// get top 4 rated lessons
	const topLessons = await Lesson.find({}).sort({ rating: -1 }).limit(4);
	res.json(topLessons);
});

// ___________________________________Search Controllers______________________________

const getSearchForLessons = async (req, res, next) => {
	const searchText = req.params.text;

	try {
		const foundLessons = await Lesson.searchForLesson(searchText);
		res.status(200).json({ lessons: foundLessons });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

export {
	getLessonById,
	getAllLessons,
	deleteLesson,
	createLesson,
	updateLesson,
	createLessonReview,
	getTopLessons,
	getSearchForLessons,
};

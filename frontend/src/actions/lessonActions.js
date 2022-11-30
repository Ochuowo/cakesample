import {
	LESSON_DETAILS_FAILURE,
	LESSON_DETAILS_REQUEST,
	LESSON_DETAILS_SUCCESS,
	LESSON_LIST_FAILURE,
	LESSON_LIST_REQUEST,
	LESSON_LIST_SUCCESS,
	LESSON_DELETE_FAILURE,
	LESSON_DELETE_REQUEST,
	LESSON_DELETE_SUCCESS,
	LESSON_CREATE_REQUEST,
	LESSON_CREATE_SUCCESS,
	LESSON_CREATE_FAILURE,
	LESSON_UPDATE_REQUEST,
	LESSON_UPDATE_SUCCESS,
	LESSON_UPDATE_FAILURE,
	LESSON_CREATE_REVIEW_REQUEST,
	LESSON_CREATE_REVIEW_SUCCESS,
	LESSON_CREATE_REVIEW_FAILURE,
	LESSON_TOP_RATED_REQUEST,
	LESSON_TOP_RATED_SUCCESS,
	LESSON_TOP_RATED_FAILURE,
} from '../constants/lessonConstants';
import axios from 'axios';

// list orders based on keyword and page number when paginated
export const listLessons =
	(keyword = '', pageNumber = '', pageSize = '') =>
	async (dispatch) => {
		try {
			dispatch({ type: LESSON_LIST_REQUEST });

			const { data } = await axios.get(
				`/api/lessons?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}`
			);

			dispatch({ type: LESSON_LIST_SUCCESS, payload: data });
		} catch (error) {
			dispatch({
				type: LESSON_LIST_FAILURE,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

// fetch details of a particular lesson
export const listLessonDetails = (id) => async (dispatch) => {
	try {
		dispatch({ type: LESSON_DETAILS_REQUEST });

		const { data } = await axios.get(`/api/lessons/${id}`);

		dispatch({ type: LESSON_DETAILS_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: LESSON_DETAILS_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// delete a particular lesson by taking an id
export const deleteLesson = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: LESSON_DELETE_REQUEST });

		const {
			userLogin: { userInfo },
		} = getState();

		// different headers are used when it is a social login, and when it is a std email login
		const config = userInfo.isSocialLogin
			? {
					headers: {
						Authorization: `SocialLogin ${userInfo.id}`,
					},
			  }
			: {
					headers: {
						Authorization: `Bearer ${userInfo.accessToken}`,
					},
			  };

		const { data } = await axios.delete(`/api/lessons/${id}`, config);

		data && dispatch({ type: LESSON_DELETE_SUCCESS });
	} catch (error) {
		dispatch({
			type: LESSON_DELETE_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// create a lesson, when the user is an admin
export const createLesson = () => async (dispatch, getState) => {
	try {
		dispatch({ type: LESSON_CREATE_REQUEST });

		const {
			userLogin: { userInfo },
		} = getState();

		// different headers are used when it is a social login, and when it is a std email login
		const config = userInfo.isSocialLogin
			? {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `SocialLogin ${userInfo.id}`,
					},
			  }
			: {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${userInfo.accessToken}`,
					},
			  };

		const { data } = await axios.post(`/api/lessons/`, {}, config);

		dispatch({ type: LESSON_CREATE_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: LESSON_CREATE_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// update the lesson details from the admin panel view
export const updateLesson = (lesson) => async (dispatch, getState) => {
	try {
		dispatch({ type: LESSON_UPDATE_REQUEST });

		const {
			userLogin: { userInfo },
		} = getState();

		// different headers are used when it is a social login, and when it is a std email login
		const config = userInfo.isSocialLogin
			? {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `SocialLogin ${userInfo.id}`,
					},
			  }
			: {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${userInfo.accessToken}`,
					},
			  };

		const { data } = await axios.put(
			`/api/lessons/${lesson._id}`,
			lesson,
			config
		);

		dispatch({ type: LESSON_UPDATE_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: LESSON_UPDATE_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// create a new lesson review for a particular lesson
export const createLessonReview =
	(lessonID, review) => async (dispatch, getState) => {
		try {
			dispatch({ type: LESSON_CREATE_REVIEW_REQUEST });

			const {
				userLogin: { userInfo },
			} = getState();

			// different headers are used when it is a social login, and when it is a std. email login
			const config = userInfo.isSocialLogin
				? {
						headers: {
							'Content-Type': 'application/json',
							Authorization: `SocialLogin ${userInfo.id}`,
						},
				  }
				: {
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${userInfo.accessToken}`,
						},
				  };

			await axios.post(
				`/api/lessons/${lessonID}/reviews`,
				review,
				config
			);

			dispatch({ type: LESSON_CREATE_REVIEW_SUCCESS });
		} catch (error) {
			dispatch({
				type: LESSON_CREATE_REVIEW_FAILURE,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

// fetch the top rated lessons for the carousel
export const getTopRatedLessons = () => async (dispatch) => {
	try {
		dispatch({ type: LESSON_TOP_RATED_REQUEST });

		const { data } = await axios.get('/api/lessons/top');

		dispatch({ type: LESSON_TOP_RATED_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: LESSON_TOP_RATED_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

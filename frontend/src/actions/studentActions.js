import {
	STUDENT_LOGIN_REQUEST,
	STUDENT_LOGIN_SUCCESS,
	STUDENT_LOGIN_FAILURE,
	STUDENT_LOGIN_REFRESH_REQUEST,
	STUDENT_LOGIN_REFRESH_SUCCESS,
	STUDENT_LOGIN_REFRESH_FAILURE,
	STUDENT_LOGOUT,
	STUDENT_REGISTER_REQUEST,
	STUDENT_REGISTER_SUCCESS,
	STUDENT_REGISTER_FAILURE,
	STUDENT_RESET_PASSWORD_REQUEST,
	STUDENT_RESET_PASSWORD_SUCCESS,
	STUDENT_RESET_PASSWORD_FAILURE,
	STUDENT_EMAIL_VERIFICATION_REQUEST,
	STUDENT_EMAIL_VERIFICATION_SUCCESS,
	STUDENT_EMAIL_VERIFICATION_FAILURE,
	STUDENT_CONFIRM_REQUEST,
	STUDENT_CONFIRM_SUCCESS,
	STUDENT_CONFIRM_FAILURE,
	STUDENT_DETAILS_REQUEST,
	STUDENT_DETAILS_SUCCESS,
	STUDENT_DETAILS_FAILURE,
	STUDENT_DETAILS_RESET,
	STUDENT_PROFILE_UPDATE_REQUEST,
	STUDENT_PROFILE_UPDATE_SUCCESS,
	STUDENT_PROFILE_UPDATE_FAILURE,
	STUDENT_LIST_REQUEST,
	STUDENT_LIST_SUCCESS,
	STUDENT_LIST_FAILURE,
	STUDENT_DELETE_REQUEST,
	STUDENT_DELETE_SUCCESS,
	STUDENT_DELETE_FAILURE,
	STUDENT_UPDATE_REQUEST,
	STUDENT_UPDATE_SUCCESS,
	STUDENT_UPDATE_FAILURE,
} from '../constants/studentConstants';
import {
	ORDER_CREATE_RESET,
	ORDER_STUDENT_LIST_RESET,
} from '../constants/orderConstants';
import axios from 'axios';

// login a student, can be a social login or a normal email verified login
export const loginStudent = (email, password) => async (dispatch) => {
	try {
		dispatch({ type: STUDENT_LOGIN_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const { data } = await axios.post(
			'/api/students/login',
			{ email, password },
			config
		);

		dispatch({
			type: STUDENT_LOGIN_SUCCESS,
			payload: { ...data, isSocialLogin: false },
		});
		dispatch({
			type: STUDENT_LOGIN_REFRESH_SUCCESS,
			payload: data.refreshToken,
		});
		// store the refresh token and the rest of the student info in the local storage
		localStorage.setItem('refreshToken', data.refreshToken);
		localStorage.setItem(
			'studentInfo',
			JSON.stringify({ ...data, isSocialLogin: false })
		);
		// remove the variable that helps prompt the student that email is not verified, each time they login
		localStorage.removeItem('promptEmailVerfication');
	} catch (error) {
		dispatch({
			type: STUDENT_LOGIN_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// used for refreshing the access tokens when the student logs in using email and password
export const refreshLogin = (email) => async (dispatch, getState) => {
	try {
		dispatch({ type: STUDENT_LOGIN_REFRESH_REQUEST });
		const {
			studentLogin: { studentInfo },
		} = getState();

		// avoid this if it's a social login
		if (studentInfo.isSocialLogin) {
			dispatch({ type: STUDENT_LOGIN_REFRESH_SUCCESS, payload: null });
		} else {
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			};

			const { data } = await axios.post(
				'/api/students/refresh',
				{
					email,
					token: studentInfo.refreshToken,
				},
				config
			);

			if (data.success) {
				dispatch({ type: STUDENT_LOGIN_REFRESH_SUCCESS, payload: data });
				const updatedStudent = {
					...studentInfo,
					accessToken: data.accessToken,
					refreshToken: studentInfo.refreshToken,
				};
				// update the local storage
				localStorage.setItem('studentInfo', JSON.stringify(updatedStudent));
				dispatch({ type: STUDENT_LOGIN_SUCCESS, payload: updatedStudent });
			} else if (!data.success) {
				// set a variable in local storage which redirects to login page, if this refresh thing fails
				localStorage.removeItem('studentInfo');
				localStorage.setItem('redirectLogin', 'true'); // after refresh token also expires, redirect to login page after loggin out the student
				dispatch({ type: STUDENT_LOGOUT });
			}
		}
	} catch (error) {
		dispatch({
			type: STUDENT_LOGIN_REFRESH_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// logout by removing all local storage info
export const logoutStudent = () => (dispatch) => {
	localStorage.removeItem('studentInfo');
	localStorage.removeItem('redirectLogin');
	localStorage.removeItem('cartItems');
	dispatch({ type: STUDENT_LOGOUT });
	dispatch({ type: STUDENT_DETAILS_RESET });
	dispatch({ type: ORDER_CREATE_RESET });
	dispatch({ type: ORDER_STUDENT_LIST_RESET });
};

// register a new student with the form for name, email, password
export const registerStudent = (name, email, password) => async (dispatch) => {
	try {
		dispatch({ type: STUDENT_REGISTER_REQUEST });
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const { data } = await axios.post(
			'/api/students/',
			{ name, email, password },
			config
		);

		dispatch({ type: STUDENT_REGISTER_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: STUDENT_REGISTER_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// send an email for verification of the newly registered account
export const sendVerficationEmail = (email) => async (dispatch) => {
	try {
		dispatch({ type: STUDENT_EMAIL_VERIFICATION_REQUEST });
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const { data } = await axios.post(
			'/api/students/confirm',
			{ email },
			config
		);
		dispatch({ type: STUDENT_EMAIL_VERIFICATION_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: STUDENT_EMAIL_VERIFICATION_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// take the email token sent from the mail, and confirm the account once the link is clicked
export const confirmStudent =
	(emailToken, alreadyLoggedIn = false) =>
	async (dispatch, getState) => {
		try {
			dispatch({ type: STUDENT_CONFIRM_REQUEST });
			const { data } = await axios.get(
				`/api/students/confirm/${emailToken}`
			);

			// remove variable meant to prompt the student for email verification
			localStorage.removeItem('promptEmailVerfication');
			dispatch({ type: STUDENT_CONFIRM_SUCCESS, payload: true });

			if (alreadyLoggedIn) {
				dispatch({ type: STUDENT_LOGIN_SUCCESS, payload: data });
				dispatch({
					type: STUDENT_LOGIN_REFRESH_SUCCESS,
					payload: data.refreshToken,
				});
				localStorage.setItem('refreshToken', data.refreshToken);
				localStorage.setItem('studentInfo', JSON.stringify(data));
			}

			localStorage.removeItem('promptEmailVerfication');
		} catch (error) {
			dispatch({
				type: STUDENT_CONFIRM_FAILURE,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

// reset the student password and send one more verification email from the server
export const resetStudentPassword =
	(passwordToken, password) => async (dispatch) => {
		try {
			dispatch({ type: STUDENT_RESET_PASSWORD_REQUEST });

			// make the api call to reset the password
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			};

			const { data } = await axios.put(
				'/api/students/reset',
				{ passwordToken, password },
				config
			);

			dispatch({ type: STUDENT_RESET_PASSWORD_SUCCESS, payload: data });
		} catch (error) {
			dispatch({
				type: STUDENT_RESET_PASSWORD_FAILURE,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

// get student details for profile page
export const getStudentDetails = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: STUDENT_DETAILS_REQUEST });

		const {
			studentLogin: { studentInfo },
		} = getState();

		if (studentInfo.isSocialLogin) {
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			};

			let { data } = await axios.post(
				'/api/students/passport/data/',
				{ id },
				config
			);
			dispatch({
				type: STUDENT_DETAILS_SUCCESS,
				payload: { ...data, isSocialLogin: true },
			});
		} else {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${studentInfo.accessToken}`,
				},
			};

			const { data } = await axios.get(`/api/students/${id}`, config);
			dispatch({
				type: STUDENT_DETAILS_SUCCESS,
				payload: { ...data, isSocialLogin: false },
			});
		}
	} catch (error) {
		dispatch({
			type: STUDENT_DETAILS_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// update details in the student profile page
export const updateStudentProfile = (student) => async (dispatch, getState) => {
	try {
		dispatch({ type: STUDENT_PROFILE_UPDATE_REQUEST });

		const {
			studentLogin: { studentInfo },
		} = getState();

		// different headers are used when it is a social login, and when it is a std email login
		const config = studentInfo.isSocialLogin
			? {
					headers: {
						Authorization: `SocialLogin ${studentInfo.id}`,
					},
			  }
			: {
					headers: {
						Authorization: `Bearer ${studentInfo.accessToken}`,
					},
			  };

		const isSocial = studentInfo.isSocialLogin;
		const { data } = await axios.put('/api/students/profile', student, config);

		dispatch({
			type: STUDENT_PROFILE_UPDATE_SUCCESS,
			payload: { ...data, isSocialLogin: isSocial },
		});

		// login the student after updating the information
		dispatch({
			type: STUDENT_LOGIN_SUCCESS,
			payload: { ...data, isSocialLogin: isSocial },
		});

		localStorage.setItem(
			'studentInfo',
			JSON.stringify({ ...data, isSocialLogin: isSocial })
		);
	} catch (error) {
		dispatch({
			type: STUDENT_PROFILE_UPDATE_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// fetch a list of all students, for the admin panel view
export const listAllStudents =
	(pageNumber = '') =>
	async (dispatch, getState) => {
		try {
			dispatch({ type: STUDENT_LIST_REQUEST });

			const {
				studentLogin: { studentInfo },
			} = getState();

			// different headers are used when it is a social login, and when it is a std email login
			const config = studentInfo.isSocialLogin
				? {
						headers: {
							Authorization: `SocialLogin ${studentInfo.id}`,
						},
				  }
				: {
						headers: {
							Authorization: `Bearer ${studentInfo.accessToken}`,
						},
				  };

			const { data } = await axios.get(
				`/api/students?pageNumber=${pageNumber}`,
				config
			);

			dispatch({ type: STUDENT_LIST_SUCCESS, payload: data });
		} catch (error) {
			dispatch({
				type: STUDENT_LIST_FAILURE,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

// delete the student from the admin panel view
export const deleteStudent = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: STUDENT_DELETE_REQUEST });

		const {
			studentLogin: { studentInfo },
		} = getState();

		// different headers are used when it is a social login, and when it is a std email login
		const config = studentInfo.isSocialLogin
			? {
					headers: {
						Authorization: `SocialLogin ${studentInfo.id}`,
					},
			  }
			: {
					headers: {
						Authorization: `Bearer ${studentInfo.accessToken}`,
					},
			  };

		await axios.delete(`/api/students/${id}`, config);

		dispatch({ type: STUDENT_DELETE_SUCCESS });
	} catch (error) {
		dispatch({
			type: STUDENT_DELETE_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// update the student details
export const updateStudent = (student) => async (dispatch, getState) => {
	try {
		dispatch({ type: STUDENT_UPDATE_REQUEST });

		const {
			studentLogin: { studentInfo },
		} = getState();

		const config = studentInfo.isSocialLogin
			? {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `SocialLogin ${studentInfo.id}`,
					},
			  }
			: {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${studentInfo.accessToken}`,
					},
			  };

		const isSocial = studentInfo.isSocialLogin;
		const { data } = await axios.put(
			`/api/students/${student._id}`,
			student,
			config
		);

		dispatch({ type: STUDENT_UPDATE_SUCCESS });
		dispatch({
			type: STUDENT_DETAILS_SUCCESS,
			payload: { ...data, isSocialLogin: isSocial },
		});

		if (data.id === studentInfo.id) {
			// // login the student after updating the information
			const newStudentInfo = {
				...studentInfo,
				...studentInfo,
				id: data.id,
				name: data.name,
				email: data.email,
				isAdmin: data.isAdmin,
				isConfirmed: data.isConfirmed,
			};
			dispatch({
				type: STUDENT_LOGIN_SUCCESS,
				payload: newStudentInfo,
			});

			localStorage.setItem('studentInfo', JSON.stringify(newStudentInfo));
		}
	} catch (error) {
		dispatch({
			type: STUDENT_UPDATE_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

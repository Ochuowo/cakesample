import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { listLessonDetails, updateLesson } from '../actions/lessonActions';
import { LESSON_UPDATE_RESET } from '../constants/lessonConstants';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { refreshLogin, getUserDetails } from '../actions/userActions';
import dotenv from 'dotenv';

import FormContainer from '../components/FormContainer';

dotenv.config();

const LessonEditPage = ({ match, history }) => {
	// all variables for storing lesson details
	const lessonId = match.params.id;
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState(0.0);
	const [studentsInLesson, setStudentsInLesson] = useState(0);
	const [rating, setRating] = useState('');

	const dispatch = useDispatch();

	const lessonDetails = useSelector((state) => state.lessonDetails);
	const { loading, lesson, error } = lessonDetails;

	const lessonUpdate = useSelector((state) => state.lessonUpdate);
	const {
		loading: loadingUpdate,
		success: successUpdate,
		error: errorUpdate,
	} = lessonUpdate;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userDetails = useSelector((state) => state.userDetails);
	const { error: userLoginError } = userDetails;

	
	// fetch user login details
	useEffect(() => {
		userInfo
			? userInfo.isSocialLogin
				? dispatch(getUserDetails(userInfo.id))
				: dispatch(getUserDetails('profile'))
			: dispatch(getUserDetails('profile'));
	}, [userInfo, dispatch]);

	// fetch new access tokens if user details fail, using the refresh token
	useEffect(() => {
		if (userLoginError && userInfo && !userInfo.isSocialLogin) {
			const user = JSON.parse(localStorage.getItem('userInfo'));
			user && dispatch(refreshLogin(user.email));
		}
	}, [userLoginError, dispatch, userInfo]);

	useEffect(() => {
		dispatch(listLessonDetails(lessonId));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// update the lesson details in state
	useEffect(() => {
		if (successUpdate) {
			dispatch({ type: LESSON_UPDATE_RESET });
			history.push('/admin/lessonlist');
		} else {
			if (!lesson || lesson._id !== lessonId) {
				dispatch(listLessonDetails(lessonId));
			} else {
				setName(lesson.name);
				setPrice(lesson.price);
				setRating(lesson.rating);
				setDescription(lesson.description);
				setStudentsInLesson(lesson.studentsInLesson);
			}
		}
	}, [lesson, dispatch, lessonId, history, successUpdate]);

	// submit the lesson details
	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(
			updateLesson({
				_id: lessonId,
				name,
				rating,
				price,
				description,
				studentsInLesson,
			})
		);
	};

	return (
		<>
			<Link to='/admin/lessonlist'>
				<Button variant='outline-primary' className='mt-3'>
					Go Back
				</Button>
			</Link>
			<FormContainer style={{ marginTop: '-2em' }}>
				<h1>Edit Lesson</h1>
				{loadingUpdate ? (
					<Loader />
				) : errorUpdate ? (
					<Message dismissible variant='danger' duration={10}>
						{errorUpdate}
					</Message>
				) : (
					<>
						{loading ? (
							<Loader />
						) : (
							<Form onSubmit={handleSubmit}>
								{error && (
									<Message
										dismissible
										variant='danger'
										duration={10}>
										{error}
									</Message>
								)}
								<Form.Group controlId='name'>
									<FloatingLabel
										controlId='nameinput'
										label='Name'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter Name'
											type='text'
											value={name}
											onChange={(e) =>
												setName(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='price'>
									<FloatingLabel
										controlId='priceinput'
										label='Price'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter price'
											type='number'
											value={price}
											min='0'
											max='10000'
											step='0.1'
											onChange={(e) =>
												setPrice(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='rating'>
									<FloatingLabel
										controlId='ratinginput'
										label='Rating'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter rating'
											type='text'
											value={rating}
											onChange={(e) =>
												setRating(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='description'>
									<FloatingLabel
										controlId='descinput'
										label='Description'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter description URL'
											type='text'
											value={description}
											onChange={(e) =>
												setDescription(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='studentsInLesson'>
									<FloatingLabel
										controlId='countinstockinput'
										label='StudentInLesson'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter Count In Stock'
											type='number'
											min='0'
											max='1000'
											value={studentsInLesson}
											onChange={(e) =>
												setStudentsInLesson(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<div className='d-flex'>
									<Button
										type='submit'
										className='my-1 ms-auto'>
										Update Lesson
									</Button>
								</div>
							</Form>
						)}
					</>
				)}
			</FormContainer>
		</>
	);
};

export default LessonEditPage;

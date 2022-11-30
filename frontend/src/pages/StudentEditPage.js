import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import FormContainer from '../components/FormContainer';
import {
	getStudentDetails,
	updateStudent,
	refreshLogin,
} from '../actions/studentActions';
import { STUDENT_UPDATE_RESET } from '../constants/studentConstants';

const StudentEditPage = ({ match, history }) => {
	const studentId = match.params.id;
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);
	const dispatch = useDispatch();

	const studentDetails = useSelector((state) => state.studentDetails);
	const { loading, student, error } = studentDetails;

	const studentUpdate = useSelector((state) => state.studentUpdate);
	const {
		loading: loadingUpdate,
		error: errorUpdate,
		success: successUpdate,
	} = studentUpdate;

	const studentLogin = useSelector((state) => state.studentLogin);
	const { studentInfo } = studentLogin;

	// get new access tokens
	useEffect(() => {
		if (error && studentInfo && !studentInfo.isSocialLogin) {
			const student = JSON.parse(localStorage.getItem('studentInfo'));
			student && dispatch(refreshLogin(student.email));
		}
	}, [error, dispatch, studentInfo]);

	// update student details from the admin panel view
	useEffect(() => {
		if (successUpdate) {
			dispatch({ type: STUDENT_UPDATE_RESET });
			history.push('/admin/studentlist');
		} else {
			if (!student || !student.name || student._id !== studentId) {
				dispatch(getStudentDetails(studentId));
			} else {
				setName(student.name);
				setEmail(student.email);
				setIsAdmin(student.isAdmin);
			}
		}
	}, [student, dispatch, studentId, successUpdate, history]);

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(updateStudent({ _id: studentId, name, email, isAdmin }));
	};

	return (
		<>
			<Link to='/admin/studentlist'>
				<Button variant='outline-primary' className='my-3'>
					Go Back
				</Button>
			</Link>
			<FormContainer>
				{student && <Meta title={`Edit ${student.name} | Cakes.Co.Ke`} />}
				<h1>Edit Student</h1>
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

								<Form.Group controlId='name' className='mb-2'>
									<Form.Label>Name</Form.Label>
									<Form.Control
										size='lg'
										placeholder='Enter Name'
										type='text'
										value={name}
										onChange={(e) =>
											setName(e.target.value)
										}
									/>
								</Form.Group>
								<Form.Group controlId='email' className='my-2'>
									<Form.Label>Email Address</Form.Label>
									<Form.Control
										size='lg'
										placeholder='Enter Email Address'
										type='email'
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
									/>
								</Form.Group>
								<Form.Group
									controlId='isAdmin'
									className='my-2'>
									<InputGroup>
										<Form.Check
											type='checkbox'
											label='Is Admin'
											size='lg'
											style={{ borderRight: 'none' }}
											checked={isAdmin}
											onChange={(e) =>
												setIsAdmin(e.target.checked)
											}></Form.Check>
									</InputGroup>
								</Form.Group>
								<Button
									type='submit'
									variant='dark'
									className='my-1'>
									Edit
								</Button>
							</Form>
						)}
					</>
				)}
			</FormContainer>
		</>
	);
};

export default StudentEditPage;

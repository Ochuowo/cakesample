import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Button, Row, Col } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
	listLessons,
	deleteLesson,
	createLesson,
} from '../actions/lessonActions';
import { LESSON_CREATE_RESET } from '../constants/lessonConstants';
import Paginate from '../components/Paginate';
import { refreshLogin, getUserDetails } from '../actions/userActions';

const LessonListPage = ({ history, match }) => {
	const pageNumber = match.params.pageNumber || 1;
	const dispatch = useDispatch();
	const lessonList = useSelector((state) => state.lessonList);
	const { loading, lessons, error, pages, page } = lessonList;

	const lessonDelete = useSelector((state) => state.lessonDelete);
	const {
		loading: loadingDelete,
		success: successDelete,
		error: errorDelete,
	} = lessonDelete;

	const lessonCreate = useSelector((state) => state.lessonCreate);
	const {
		loading: loadingCreate,
		success: successCreate,
		error: errorCreate,
		lesson: createdLesson,
	} = lessonCreate;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userDetails = useSelector((state) => state.userDetails);
	const { error: userLoginError } = userDetails;

	// fetch user login info
	useEffect(() => {
		userInfo
			? userInfo.isSocialLogin
				? dispatch(getUserDetails(userInfo.id))
				: dispatch(getUserDetails('profile'))
			: dispatch(getUserDetails('profile'));
	}, [userInfo, dispatch]);

	// refresh token for expired access tokens
	useEffect(() => {
		if (userLoginError && userInfo && !userInfo.isSocialLogin) {
			const user = JSON.parse(localStorage.getItem('userInfo'));
			user && dispatch(refreshLogin(user.email));
		}
	}, [userLoginError, dispatch, userInfo]);

	useEffect(() => {
		if (!userInfo.isAdmin) history.push('/login');
		dispatch({ type: LESSON_CREATE_RESET }); //reset the new lesson detail
		if (successCreate)
			history.push(`/admin/lesson/${createdLesson._id}/edit`);
		else dispatch(listLessons('', pageNumber, 10)); // 3rd parameter is the no of lessons to be listed per page
	}, [
		dispatch,
		history,
		userInfo,
		successDelete,
		successCreate,
		createdLesson,
		pageNumber,
	]);

	// delete lesson after confirming
	const handleDelete = (id) => {
		if (window.confirm('Are you sure you wanna delete this lesson?'))
			dispatch(deleteLesson(id));
	};
	// create a new dummy lesson
	const handleCreateLesson = () => {
		dispatch(createLesson());
	};
	return (
		<>
		<div className="tabs">
			<input type="radio" name="class" id="tabone" 
			checked="checked" readOnly/>
			<label htmlFor="tabone">All Lessons</label>
			<div className="tab">
			<Row className='align-items-center'>
				<Col>
					<h1>Lessons</h1>
				</Col>
				<Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
					<Button
						className='my-3'
						style={{
							padding: '0.5em 1em',
						}}
						onClick={handleCreateLesson}>
						<i className='fas fa-plus' /> Create Lesson
					</Button>
				</Col>
			</Row>
			{errorDelete && (
				<Message dismissible variant='danger' duration={10}>
					{errorDelete}
				</Message>
			)}
			{errorCreate && (
				<Message dismissible variant='danger' duration={10}>
					{errorCreate}
				</Message>
			)}
			{loading || loadingCreate || loadingDelete ? (
				<Loader />
			) : error ? (
				<Message dismissible variant='danger' duration={10}>
					{error}
				</Message>
			) : (
				<>
					<Table
						striped
						bordered
						responsive
						className='table-sm text-center'>
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>PRICE</th>
								<th>DESCRIPTION</th>
								<th>STUDENTSINLESSON</th>
								<th>ACTION</th>
							</tr>
						</thead>
						<tbody>
							{lessons &&
								lessons.map((lesson) => {
									return (
										<tr key={lesson._id}>
											<td>{lesson._id}</td>
											<td>{lesson.name}</td>
											<td>
												{lesson.price &&
													lesson.price.toLocaleString(
														'en-UK',
														{
															maximumFractionDigits: 2,
															style: 'currency',
															currency: 'Ksh',
														}
													)}
											</td>
											<td>{lesson.category}</td>
											<td>{lesson.brand}</td>

											<td
												style={{
													display: 'flex',
													alignItems: 'center',
													justifyContent:
														'space-around',
												}}>
												<LinkContainer
													to={`/admin/lesson/${lesson._id}/edit`}>
													<Button
														variant='link'
														className='btn-sm'>
														<i className='fas fa-edit' />
													</Button>
												</LinkContainer>
												<Button
													className='btn-sm'
													onClick={() =>
														handleDelete(
															lesson._id
														)
													}
													variant='danger'>
													<i
														style={{
															fontSize: '0.9em',
															padding: '0',
														}}
														className='fas fa-trash'
													/>
												</Button>
											</td>
										</tr>
									);
								})}
						</tbody>
					</Table>
					<Paginate pages={pages} page={page} isAdmin={true} />
				</>
			)}
			</div>
			<input type="radio" name="class" id="tabtwo"/>
			<label htmlFor="tabtwo">Inventory Module</label>
			<div className="tab">
			<Row className='align-items-center'>
				<Col>
					<h1>All Lessons</h1>
				</Col>
				<Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
					<Button
						className='my-3'
						style={{
							padding: '0.5em 1em',
						}}
						onClick={handleCreateLesson}>
						<i className='fas fa-plus' /> Create New List
					</Button>
				</Col>
			</Row>
			{errorDelete && (
				<Message dismissible variant='danger' duration={10}>
					{errorDelete}
				</Message>
			)}
			{errorCreate && (
				<Message dismissible variant='danger' duration={10}>
					{errorCreate}
				</Message>
			)}
			{loading || loadingCreate || loadingDelete ? (
				<Loader />
			) : error ? (
				<Message dismissible variant='danger' duration={10}>
					{error}
				</Message>
			) : (
				<>
					<Table
						striped
						bordered
						responsive
						className='table-sm text-center'>
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>PRICE</th>
								<th>DESCRIPTION</th>
								<th>STUDENTSINLESSON</th>
								<th>ACTION</th>
							</tr>
						</thead>
						<tbody>
							{lessons &&
								lessons.map((lesson) => {
									return (
										<tr key={lesson._id}>
											<td>{lesson._id}</td>
											<td>{lesson.name}</td>
											<td>
												{lesson.price &&
													lesson.price.toLocaleString(
														'en-UK',
														{
															maximumFractionDigits: 2,
															style: 'currency',
															currency: 'Ksh',
														}
													)}
											</td>
											<td>{lesson.category}</td>
											<td>{lesson.brand}</td>

											<td
												style={{
													display: 'flex',
													alignItems: 'center',
													justifyContent:
														'space-around',
												}}>
												<LinkContainer
													to={`/admin/lesson/${lesson._id}/edit`}>
													<Button
														variant='link'
														className='btn-sm'>
														<i className='fas fa-edit' />
													</Button>
												</LinkContainer>
												<Button
													className='btn-sm'
													onClick={() =>
														handleDelete(
															lesson._id
														)
													}
													variant='danger'>
													<i
														style={{
															fontSize: '0.9em',
															padding: '0',
														}}
														className='fas fa-trash'
													/>
												</Button>
											</td>
										</tr>
									);
								})}
						</tbody>
					</Table>
					<Paginate pages={pages} page={page} isAdmin={true} />
				</>
			)}
			</div>
			<input type="radio" name="class" id="tabthree"/>
			<label htmlFor="tabthree">Kitchen Management</label>
			<div className="tab">
			<Row className='align-items-center'>
				<Col>
					<h1>Incoming / Outcoming</h1>
				</Col>
				<Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
					<Button
						className='my-3'
						style={{
							padding: '0.5em 1em',
						}}
						onClick={handleCreateLesson}>
						<i className='fas fa-plus' /> Manage Shelves
					</Button>
				</Col>
			</Row>
			{errorDelete && (
				<Message dismissible variant='danger' duration={10}>
					{errorDelete}
				</Message>
			)}
			{errorCreate && (
				<Message dismissible variant='danger' duration={10}>
					{errorCreate}
				</Message>
			)}
			{loading || loadingCreate || loadingDelete ? (
				<Loader />
			) : error ? (
				<Message dismissible variant='danger' duration={10}>
					{error}
				</Message>
			) : (
				<>
					<Table
						striped
						bordered
						responsive
						className='table-sm text-center'>
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>PRICE</th>
								<th>DESCRIPTION</th>
								<th>STUDENTSINLESSON</th>
								<th>ACTION</th>
							</tr>
						</thead>
						<tbody>
							{lessons &&
								lessons.map((lesson) => {
									return (
										<tr key={lesson._id}>
											<td>{lesson._id}</td>
											<td>{lesson.name}</td>
											<td>
												{lesson.price &&
													lesson.price.toLocaleString(
														'en-UK',
														{
															maximumFractionDigits: 2,
															style: 'currency',
															currency: 'Ksh',
														}
													)}
											</td>
											<td>{lesson.category}</td>
											<td>{lesson.brand}</td>

											<td
												style={{
													display: 'flex',
													alignItems: 'center',
													justifyContent:
														'space-around',
												}}>
												<LinkContainer
													to={`/admin/lesson/${lesson._id}/edit`}>
													<Button
														variant='link'
														className='btn-sm'>
														<i className='fas fa-edit' />
													</Button>
												</LinkContainer>
												<Button
													className='btn-sm'
													onClick={() =>
														handleDelete(
															lesson._id
														)
													}
													variant='danger'>
													<i
														style={{
															fontSize: '0.9em',
															padding: '0',
														}}
														className='fas fa-trash'
													/>
												</Button>
											</td>
										</tr>
									);
								})}
						</tbody>
					</Table>
					<Paginate pages={pages} page={page} isAdmin={true} />
				</>
			)}
			</div>
		 </div>
		</>
	);
};

export default LessonListPage;

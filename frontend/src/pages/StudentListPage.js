import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listAllStudents, deleteStudent, refreshLogin } from '../actions/studentActions';
import Paginate from '../components/Paginate';

import PLStatement from '../components/Accounts/pLStatement';
import Suppliers from '../components/Accounts/suppliers';
import Debtors from '../components/Accounts/debtors';
import DeliveriesCoupons from '../components/Accounts/deliveriesCoupons';
import Creditors from '../components/Accounts/creditors';

const StudentListPage = ({ match, history }) => {
	const pageNumber = match.params.pageNumber || 1; // to fetch various pages of orders
	const dispatch = useDispatch();
	const studentList = useSelector((state) => state.studentList);
	const { loading, students, error, page, pages, total } = studentList;

	const studentLogin = useSelector((state) => state.studentLogin);
	const { studentInfo } = studentLogin;

	const studentDelete = useSelector((state) => state.studentDelete);
	const { success: successDelete } = studentDelete;

	const studentDetails = useSelector((state) => state.studentDetails);
	const { error: studentLoginError } = studentDetails;

	useEffect(() => {
		if (studentLoginError && studentInfo && !studentInfo.isSocialLogin) {
			const student = JSON.parse(localStorage.getItem('studentInfo'));
			student && dispatch(refreshLogin(student.email));
		}
	}, [studentLoginError, dispatch, studentInfo]);

	useEffect(() => {
		if (studentInfo && studentInfo.isAdmin) dispatch(listAllStudents(pageNumber));
		else history.push('/login');
	}, [dispatch, history, studentInfo, successDelete, pageNumber]);

	const handleDelete = (id) => {
		if (window.confirm('Are you sure you want to delete student?'))
			dispatch(deleteStudent(id));
	};

	/* Toggle-bar options */
	const handleToggleBar = () => {
		const toggleButton = document.getElementsByClassName("burger")[0]
		const navpillLinks = document.getElementsByClassName("navpill-links")[0]
		const navList = document.querySelectorAll(".navpill-links li");

		toggleButton.addEventListener("click", () => {
		navpillLinks.classList.toggle("active")

		//toggle Animation
		toggleButton.classList.toggle("toggle")

		//Animate Links
		navList.forEach((link, index) =>{
			if (link.style.animation) {
				link.style.animation = ""
			} else {
			link.style.animation = `navLinkFade 0.5s ease forwards ${index / 9 + 0.3}s`
			}
		 })
	  })
	};
	
	return (
		<>
		<div className="tabs">
			<input type="radio" name="tabs" id="tabone" 
			checked="checked" readOnly/>
			<label htmlFor="tabone">Students Tab</label>
			<div className="tab">
					<h1> All Students ({`${total || 0}`})</h1>
					{loading ? (
						<Loader />
					) : error ? (
						<Message dismissible variant='danger' duration={10}>
							{error}
						</Message>
					) : (
						<Table
							striped
							bordered
							responsive
							className='table-sm text-center'>
							<thead>
								<tr>
									<th>ID</th>
									<th>NAME</th>
									<th>EMAIL</th>
									<th>CONFIRMED</th>
									<th>ADMIN</th>
									<th>ACTION</th>
								</tr>
							</thead>
							<tbody>
								{students &&
									students.map((student) => {
										return (
											<tr key={student._id}>
												<td>{student._id}</td>
												<td>{student.name}</td>
												<td>
													<a href={`mailto:${student.email}`}>
														{student.email}
													</a>
												</td>
												<td>
													{student.isConfirmed ? (
														<i
															className='fas fa-check'
															style={{ color: 'green' }}
														/>
													) : (
														<i
															className='fas fa-times'
															style={{ color: 'red' }}
														/>
													)}
												</td>
												<td>
													{student.isAdmin ? (
														<i
															className='fas fa-check'
															style={{ color: 'green' }}
														/>
													) : (
														<i
															className='fas fa-times'
															style={{ color: 'red' }}
														/>
													)}
												</td>

												<td
													style={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'space-around',
													}}>
													<LinkContainer
														to={`/admin/student/${student._id}/edit`}>
														<Button
															variant='link'
															className='btn-sm'>
															<i className='fas fa-edit' />
														</Button>
													</LinkContainer>
													<Button
														className='btn-sm'
														variant='danger'
														onClick={() =>
															handleDelete(student._id)
														}>
														<i className='fas fa-trash' />
													</Button>
												</td>
											</tr>
										);
									})}
							</tbody>
						</Table>
					)}
					<Paginate
						pages={pages}
						page={page}
						isAdmin={true}
						forStudents={true}/>
			 </div>
			 <input type="radio" name="tabs" id="tabtwo"/>
			 <label htmlFor="tabtwo">All Staff</label>
			 <div className="tab">
					<h1>Human Resource ({`${total || 0}`})</h1>
					{loading ? (
						<Loader />
					) : error ? (
						<Message dismissible variant='danger' duration={10}>
							{error}
						</Message>
					) : (
						<Table
							striped
							bordered
							responsive
							className='table-sm text-center'>
							<thead>
								<tr>
									<th>ID</th>
									<th>NAME</th>
									<th>EMAIL</th>
									<th>CONFIRMED</th>
									<th>ADMIN</th>
									<th>ACTION</th>
								</tr>
							</thead>
							<tbody>
								{students &&
									students.map((student) => {
										return (
											<tr key={student._id}>
												<td>{student._id}</td>
												<td>{student.name}</td>
												<td>
													<a href={`mailto:${student.email}`}>
														{student.email}
													</a>
												</td>
												<td>
													{student.isConfirmed ? (
														<i
															className='fas fa-check'
															style={{ color: 'green' }}
														/>
													) : (
														<i
															className='fas fa-times'
															style={{ color: 'red' }}
														/>
													)}
												</td>
												<td>
													{student.isAdmin ? (
														<i
															className='fas fa-check'
															style={{ color: 'green' }}
														/>
													) : (
														<i
															className='fas fa-times'
															style={{ color: 'red' }}
														/>
													)}
												</td>

												<td
													style={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'space-around',
													}}>
													<LinkContainer
														to={`/admin/student/${student._id}/edit`}>
														<Button
															variant='link'
															className='btn-sm'>
															<i className='fas fa-edit' />
														</Button>
													</LinkContainer>
													<Button
														className='btn-sm'
														variant='danger'
														onClick={() =>
															handleDelete(student._id)
														}>
														<i className='fas fa-trash' />
													</Button>
												</td>
											</tr>
										);
									})}
							</tbody>
						</Table>
					)}
					<Paginate
						pages={pages}
						page={page}
						isAdmin={true}
						forStudents={true}/>
			 </div>
			 <input type="radio" name="tabs" id="tabthree"/>
			 <label htmlFor="tabthree">Book Keeping</label>
			 <div className="tab">
					<h1>Financials</h1>
					{loading ? (
						<Loader />
					) : error ? (
						<Message dismissible variant='danger' duration={10}>
							{error}
						</Message>
					) : (
						<>
						{ /* <!-- navtabs --> */ }
						<div className="navpill">
							<div className="brand-title">Accounts / Suppliers </div>
								<div className="burger" onClick={handleToggleBar}>
									<div className="bar1"></div>
									<div className="bar2"></div>
									<div className="bar3"></div>
								</div>
								<div className="navpill-links">
									<ul>
										<li className="nav-item">
											<a className="nav-link active" data-bs-toggle="tab" href="#PLStatement">P/L Statement</a>
										</li>
										<li className="nav-item">
											<a className="nav-link" data-bs-toggle="tab" href="#Suppliers">Suppliers</a>
										</li>
										<li className="nav-item">
											<a className="nav-link" data-bs-toggle="tab" href="#Creditors">Creditors</a>
										</li>
										<li className="nav-item">
											<a className="nav-link" data-bs-toggle="tab" href="#Debtors">Debtors</a>
										</li>
										<li className="nav-item">
											<a className="nav-link" data-bs-toggle="tab" href="#DeliveriesCoupons">Deliveries/Coupons</a>
										</li>
									</ul>
								</div>
						</div>
						{ /* <!-- navtabs content display--> */ }
							<div className="tab-content">
									<div className="tab-pane container active" id="PLStatement">
										<PLStatement />
									</div>
									<div className="tab-pane container fade" id="Suppliers">
										<Suppliers />
									</div>
									<div className="tab-pane container fade" id="Creditors">
										<Creditors />
									</div>
									<div className="tab-pane container fade" id="Debtors">
										<Debtors />
									</div>
									<div className="tab-pane container fade" id="DeliveriesCoupons">
										<DeliveriesCoupons />
									</div>
							</div>
						</>
					)}
					<Paginate
						pages={pages}
						page={page}
						isAdmin={true}
						forStudents={true}/>
			 </div>
		 </div>
		</>
	);
};

export default StudentListPage;

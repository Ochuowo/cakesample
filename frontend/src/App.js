import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ConfirmPage from './pages/ConfirmPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import PasswordResetPage from './pages/PasswordResetPage';
import UserListPage from './pages/UserListPage';
import UserEditPage from './pages/UserEditPage';
import ProductListPage from './pages/ProductListPage';
import LessonListPage from './pages/LessonListPage';
import StudentListPage from './pages/StudentListPage';
import ProductEditPage from './pages/ProductEditPage';
import LessonEditPage from './pages/LessonEditPage';
import StudentEditPage from './pages/StudentEditPage';
import OrderListPage from './pages/OrderListPage';
import ErrorPage from './pages/ErrorPage';
import axios from 'axios';

// Admin Section
import About from './components/About/About';
// subjects
import Subjects from './components/Elements/Subjects/Subjects';
import AddSubject from './components/Add/AddSubject';
import EditSubject from './components/Edit/EditSubject';
import SubjectDetails from './components/Details/SubjectDetails';
// teachers
import Teachers from './components/Elements/Teachers/Teachers';
import AddTeacher from './components/Add/addTeachers';
import EditTeacher from './components/Edit/EditTeacher';
import PersonDetails from './components/Details/PersonDetails';

// Lessons
import Lessons from './components/Elements/Lessons/Lessons';
import AddClass from './components/Add/AddClass';
import EditClass from './components/Edit/EditClass';
import ClassDetails from './components/Details/ClassDetails';

// students
import Students from './components/Elements/Students/Students';
import AddStudent from './components/Add/AddStudent';
import StudentDetails from './components/Details/StudentDetails';
// Layout
import Layout from './components/Layout/Layout';
// NotFound
import NotFound from './components/NotFound/NotFound';
// for showing the 'new update available' banner and to register the service worker
import ServiceWorkerWrapper from './ServiceWorkerWrapper';

axios.defaults.baseURL = 'http://localhost:5000/';

const App = () => {

	return (

		<Router>
			<Header />
			<ServiceWorkerWrapper />
			<main className='py-2'>
				<Container>
					<Switch>
						<Route path='/' component={HomePage} exact />
						<Route
							path='/search/:keyword'
							component={HomePage}
							exact
						/>
						<Route
							path='/page/:pageNumber'
							component={HomePage}
							exact
						/>
						<Route
							path='/search/:keyword/page/:pageNumber'
							exact
							component={HomePage}
						/>
						<Route path='/login' component={LoginPage} />
						<Route path='/register' component={RegisterPage} />
						<Route
							path='/user/password/reset/:token'
							component={PasswordResetPage}
						/>
						<Route path='/profile' component={ProfilePage} />
						<Route path='/product/:id' component={ProductPage} />
						<Route path='/cart/:id?' component={CartPage} />
						<Route
							path='/user/confirm/:token'
							component={ConfirmPage}
							exact
						/>
						<Route path='/shipping' component={ShippingPage} />
						<Route path='/payment' component={PaymentPage} />
						<Route path='/placeorder' component={PlaceOrderPage} />
						<Route path='/order/:id' component={OrderPage} />
						<Route
							path='/admin/userlist'
							component={UserListPage}
							exact
						/>
						<Route
							path='/admin/userlist/:pageNumber'
							component={UserListPage}
							exact
						/>
						<Route
							path='/admin/user/:id/edit'
							component={UserEditPage}
						/>
						<Route
							path='/admin/productlist'
							component={ProductListPage}
							exact
						/>
						<Route
							path='/admin/productlist/:pageNumber'
							component={ProductListPage}
							exact
						/>
						<Route
							path='/admin/product/:id/edit'
							component={ProductEditPage}
						/>
						<Route
							path='/admin/orderlist'
							component={OrderListPage}
							exact
						/>
						<Route
							path='/admin/orderlist/:pageNumber'
							component={OrderListPage}
							exact
						/>
						<Route 
							path='/admin/academy'
							component={Layout}
							exact 
						/>
						<Route component={ErrorPage} />
						{/* subjects */}
                        <Route path='/About' exact component={About} />
                        <Route 
                        	path='/Subjects'
                        	component={Subjects} 
                        	exact 
                        />
                        <Route 
                        	path='/Subjects/Add' 
                        	component={AddSubject} 
                        	exact 
                        />
                        <Route 
                        	path='/Subjects/Edit/:subjectId' 
                        	component={EditSubject}
                        />
                        <Route 
                        	path='/Subjects/Details/:subjectId' 
					        component={SubjectDetails} 
                            />
                        {/* teachers */}
                        <Route 
                            path='/Teachers' 
                            component={Teachers} 
                            exact 
                            />
                        <Route 
                            path='/Teachers/Add' 
                            component={AddTeacher} 
                            exact 
                            />
                        <Route 
                            path='/Teachers/Edit/:teacherId' 
                            component={EditTeacher} 
                            />
                        <Route 
                            path='/Teachers/Details/:teacherId' 
                            component={PersonDetails}
                            />
                        {/* lessons */}
                        <Route 
                            path='/Lessons'
                            component={Lessons}
							exact
                            />
                        <Route 
							path='/Lessons/Add'
							component={AddClass}
							exact
							/>
						<Route 
							path='/Lessons/Edit/:lessonId' 
							component={EditClass}
							exact
                 	        />
                 		<Route 
							path='/Lessons/Details/:lessonId' 
							component={ClassDetails}
							exact
                 	        />
						<Route
							path='/Lesson/lessonlist'
							component={LessonListPage}
							exact
						/>
						<Route
							path='/Lessons/Edit/:lessonId'
							component={LessonEditPage}
							exact
						/>
                 		{/* Students */}
                 		<Route 
							path='/Students' 
							component={Students} 
							exact 
                 	        />
                 		<Route 
							path='/Students/Add' 
							component={AddStudent} 
							exact 
                 	        />
                 		<Route 
							path='/Students/Edit/:studentId'
							component={StudentEditPage}
                 	        />
                 		<Route 
							path='/Students/Details/:studentId' 
							component={StudentDetails}
                 	        />
						<Route
							path='/Student/studentlist'
							component={StudentListPage}
							exact
						/>
						{/* unknown url  */}
						<Route component={NotFound} />
					</Switch>
				</Container>
			</main>
			<Footer/>
		</Router>

	);
};

export default App;

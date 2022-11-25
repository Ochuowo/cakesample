import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutStatus from '../components/CheckoutStatus';
import { saveShippingAddress } from '../actions/cartActions';
import { refreshLogin, getUserDetails } from '../actions/userActions';

const ShippingPage = ({ history }) => {
	const dispatch = useDispatch();

	const cart = useSelector((state) => state.cart);
	const { cartItems, shippingAddress } = cart;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userDetails = useSelector((state) => state.userDetails);
	const { error } = userDetails;

	const [address, setAddress] = useState(shippingAddress.address);
	const [city, setCity] = useState(shippingAddress.city);
	const [houseNumber, setHouseNumber] = useState(shippingAddress.houseNumber);
	const [building, setBuilding] = useState(shippingAddress.building);
	const [mobile, setMobile] = useState(shippingAddress.mobile);

	// fetch user details from the redux store
	useEffect(() => {
		userInfo
			? userInfo.isSocialLogin
				? dispatch(getUserDetails(userInfo.id))
				: dispatch(getUserDetails('profile'))
			: dispatch(getUserDetails('profile'));
	}, [userInfo, dispatch]);

	// update access token to a new ine using the refresh tokens
	useEffect(() => {
		if (error && userInfo && !userInfo.isSocialLogin) {
			const user = JSON.parse(localStorage.getItem('userInfo'));
			user && dispatch(refreshLogin(user.email));
		}
	}, [error, dispatch, userInfo]);

	useEffect(() => {
		if (!(cartItems.length && userInfo)) {
			history.push('/');
		}
	}, [cartItems, history, userInfo]);

	// save shipping address and move to payment screen
	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(
			saveShippingAddress({
				address,
				city,
				houseNumber,
				building,
				mobile,
			})
		);
		history.push('/payment');
	};
	return (
		<FormContainer>
			<CheckoutStatus step1 step2 />
			<h1>Shipping Address</h1>
			<Form onSubmit={handleSubmit}>
				<Form.Group controlId='address'>
					<FloatingLabel
						controlId='addressinput'
						label='Address'
						className='mb-3'>
						<Form.Control
							size='lg'
							placeholder='Enter Street Address'
							type='text'
							value={address}
							required
							onChange={(e) => setAddress(e.target.value)}
						/>
					</FloatingLabel>
				</Form.Group>
				<Form.Group controlId='city'>
					<FloatingLabel
						controlId='cityinput'
						label='City'
						className='mb-3'>
						<Form.Control
							size='lg'
							placeholder='Enter City'
							type='text'
							value={city}
							required
							onChange={(e) => setCity(e.target.value)}
						/>
					</FloatingLabel>
				</Form.Group>
				<Form.Group controlId='houseNumber'>
					<FloatingLabel
						controlId='housenumberinput'
						label='House Number'
						className='mb-3'>
						<Form.Control
							size='lg'
							placeholder='Enter House Number'
							type='text'
							value={houseNumber}
							required
							onChange={(e) => setHouseNumber(e.target.value)}
						/>
					</FloatingLabel>
				</Form.Group>
				<Form.Group controlId='building'>
					<FloatingLabel
						controlId='buildinginput'
						label='Building'
						className='mb-3'>
						<Form.Control
							size='lg'
							placeholder='Enter Name of Building'
							type='text'
							value={building}
							required
							onChange={(e) => setBuilding(e.target.value)}
						/>
					</FloatingLabel>
				</Form.Group>
				<Form.Group controlId='mobile'>
					<FloatingLabel
						controlId='mobileinput'
						label='Mobile'
						className='mb-3'>
						<Form.Control
							size='lg'
							placeholder='Enter Mobile Number'
							type='text'
							value={mobile}
							required
							onChange={(e) => setMobile(e.target.value)}
						/>
					</FloatingLabel>
				</Form.Group>
				<div className='d-flex'>
					<Button
						type='submit'
						className='ms-auto'
						style={{
							padding: '0.5em 1em',
							width: '8rem',
						}}>
						Continue
					</Button>
				</div>
			</Form>
		</FormContainer>
	);
};

export default ShippingPage;

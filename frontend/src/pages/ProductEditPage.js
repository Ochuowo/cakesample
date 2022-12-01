import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, Image, FloatingLabel, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { listProductDetails, updateProduct } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { refreshLogin, getUserDetails } from '../actions/userActions';
import dotenv from 'dotenv';

import FormContainer from '../components/FormContainer';

dotenv.config();

const ProductEditPage = ({ match, history }) => {
	// all variables for storing product details
	const productId = match.params.id;
	const [name, setName] = useState('');
	const [brand, setBrand] = useState('');
	const [category, setCategory] = useState('');
	const [description, setDescription] = useState('');
	const [image, setImage] = useState('');
	const [price, setPrice] = useState(0.0);
	const [countInStock, setCountInStock] = useState(0);

	// to upload product image
	const [uploading, setUploading] = useState(false);
	const [errorImageUpload, setErrorImageUpload] = useState('');
	const dispatch = useDispatch();

	const productDetails = useSelector((state) => state.productDetails);
	const { loading, product, error } = productDetails;

	const productUpdate = useSelector((state) => state.productUpdate);
	const {
		loading: loadingUpdate,
		success: successUpdate,
		error: errorUpdate,
	} = productUpdate;

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
		dispatch(listProductDetails(productId));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// update the product details in state
	useEffect(() => {
		if (successUpdate) {
			dispatch({ type: PRODUCT_UPDATE_RESET });
			history.push('/admin/productlist');
		} else {
			if (!product || product._id !== productId) {
				dispatch(listProductDetails(productId));
			} else {
				setName(product.name);
				setPrice(product.price);
				setImage(product.image);
				setBrand(product.brand);
				setCategory(product.category);
				setDescription(product.description);
				setCountInStock(product.countInStock);
			}
		}
	}, [product, dispatch, productId, history, successUpdate]);

	// submit the product details
	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(
			updateProduct({
				_id: productId,
				name,
				brand,
				price,
				category,
				description,
				countInStock,
				image,
			})
		);
	};
	

	const handleImageClick = async () => {
	const CLOUD_NAME =  process.env.REACT_APP_CLOUD_NAME;
	const UPLOAD_PRESET = process.env.REACT_APP_UPLOAD_PRESET;

		var myWidget = window.cloudinary.createUploadWidget({
				cloudName: CLOUD_NAME, 
				uploadPreset: UPLOAD_PRESET}, 
				(error, result) => { 
					if (!error && result && result.event === "success") { 
						console.log('Done! Here is the image info: ', result.info);
						setUploading(true);
						try {
							console.log(result.info.url);
							const data = result.info.url;
							setImage(data);
							setUploading(false);
						} catch (error) {
							setErrorImageUpload('Please choose a valid image');
							setUploading(false);
						}
					}
				 }
				)
		  
		  document.getElementById("upload_widget").addEventListener("click", function(){
			  myWidget.open();
			}, 
			false
			);
	};

	const openPopUp = () =>  
	{
	
		window.open(
		'https://cloudinary.com/console/c-1865913fe74681dc976da6e9cda78c/media_library/folders/home',
		'_blank',
		'width=600',
		'height=600',
		'top=600',
		'left=600'
		);
	}

	return (
		<>
			<Link to='/admin/productlist'>
				<Button variant='outline-primary' className='mt-3'>
					Go Back
				</Button>
			</Link>
			<FormContainer style={{ marginTop: '-2em' }}>
				<h1>Edit Product</h1>
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
											max='100000'
											step='0.1'
											onChange={(e) =>
												setPrice(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								{errorImageUpload && (
									<Message
										dismissible
										variant='danger'
										duration={10}>
										{errorImageUpload}
									</Message>
								)}
								{uploading ? (
									<div>Uploading...</div>
								) : (
									<Form.Group controlId='image'>
										<Row>
											<Col md={9}>
												<FloatingLabel
													controlId='imageinput'
													label='Image URL'
													className='mb-3'>
													<Form.Control
														size='lg'
														placeholder='Enter image URL'
														type='text'
														value={image}
														onChange={(e) =>
															setImage(e.target.value)	
														}
													/>
												</FloatingLabel>
												<Button variant='outline-primary' className='mt-3'
												onClick={openPopUp}>
												Photo Collection
												</Button>
											<br></br>
											<br></br>
											</Col>
											<Col md={3}>
												<input
													accept='image/*'
													type='file'
													id='file'
													onChange={setImage}
													style={{ display: 'none' }}
												/>
												<div
													className='profile-page-image'
													style={{
														alignSelf: 'center',
													}}>
													<Image
														src={image}
														alt={name}
														title='Click to input file'
														style={{
															width: '100%',
															border: '1px solid #ced4da',
															marginBottom: '1em',
															cursor: 'pointer',
															borderRadius:
																'0.25rem',
														}}
													/>
													<div id="upload_widget"
														className='image-overlay-product'
														onClick={
															handleImageClick
														}>
														Click to Upload
													</div>
												</div>
											</Col>	
										</Row>
									</Form.Group>
								)}
								<Form.Group controlId='brand'>
									<FloatingLabel
										controlId='brandinput'
										label='Brand'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter brand'
											type='text'
											value={brand}
											onChange={(e) =>
												setBrand(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='category'>
									<FloatingLabel
										controlId='categoryinput'
										label='Category'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter category'
											type='text'
											value={category}
											onChange={(e) =>
												setCategory(e.target.value)
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
								<Form.Group controlId='countInStock'>
									<FloatingLabel
										controlId='countinstockinput'
										label='CountInStock'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter Count In Stock'
											type='number'
											min='0'
											max='1000'
											value={countInStock}
											onChange={(e) =>
												setCountInStock(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<div className='d-flex'>
									<Button
										type='submit'
										className='my-1 ms-auto'>
										Update Product
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

export default ProductEditPage;

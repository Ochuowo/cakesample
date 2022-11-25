import React, { Fragment, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Intro from '../Intro/Intro';
import axios from 'axios';
import { Button } from '@material-ui/core';
import MyAlert from '../UI/Alert/Alert';
import Loader from '../UI/Loader/Loader';

const AddClass = () => {
	const [ setState ] = useState({
		name: '',
		lessonDescription: '',
		price: '',
		studentsInClass: '',
		loading: false,
		doneObj: null
	},[]);


	const writeHandler = (e) => {
		setState({ [e.target.name]: e.target.value });
	};
	const addLessonHandler = async (e) => {
		e.preventDefault();
		setState({ loading: true });
		try {
			const addingResult = await axios.post(`api/lessons`, { name: this.state.name });
			console.log('AddSubject -> addingResult', addingResult);
			let doneObj = { message: addingResult.data.message, type: 'success' };

			setState({ loading: false, doneObj: doneObj });
		} catch (error) {
			console.log(error.response.data.error);
			let doneObj = { message: error.response.data.error, type: 'error' };
			setState({ loading: false, doneObj: doneObj });
		}
	};
	
		return (
			<Fragment>
				<Intro logo='Class' thisCategory='Add Lesson' />
				<form onSubmit={addLessonHandler}>
					<div className='addForm'>
						<TextField
							id='outlined-basic'
							label='Lesson Name'
							variant='outlined'
							name='name'
							onChange={writeHandler}
							style={{ width: '100%' }}
							required
						/>
						<br />
						<TextField
							id='outlined-basic'
							label='Lesson Description'
							variant='outlined'
							name='description'
							onChange={writeHandler}
							style={{ width: '100%' }}
							required
						/>
						<br />
						<TextField
							id='outlined-basic'
							label='Price'
							variant='outlined'
							name='price'
							onChange={writeHandler}
							style={{ width: '100%' }}
							required
						/>
						<br />
						<TextField
							id='outlined-basic'
							label='Students in class'
							variant='outlined'
							name='studentsInLesson'
							onChange={writeHandler}
							style={{ width: '100%' }}
							required
						/>
						<br />
						<TextField
							id='outlined-basic'
							label='Rating'
							variant='outlined'
							name='rating'
							onChange={writeHandler}
							style={{ width: '100%' }}
							required
						/>
						<br />
						<TextField
							id='outlined-basic'
							label='Reviews'
							variant='outlined'
							name='numReviews'
							onChange={writeHandler}
							style={{ width: '100%' }}
							required
						/>
						<br />
						<Button variant='contained' color='primary' type='submit'>
							Submit
						</Button>
						{this.state.loading && <Loader />}
						<br />
						<br />
						{this.state.doneObj && (
							<MyAlert message={this.state.doneObj.message} type={this.state.doneObj.type} />
						)}
					</div>
				</form>
			</Fragment>
		);
}

export default AddClass;

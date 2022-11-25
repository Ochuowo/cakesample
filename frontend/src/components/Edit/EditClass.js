import React, { Fragment, Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Intro from '../Intro/Intro';
import axios from 'axios';
import { Button } from '@material-ui/core';
import MyAlert from '../UI/Alert/Alert';
import Loader from '../UI/Loader/Loader';

export default class EditClass extends Component {
	state = {
		name: '',
		loading: false,
		doneObj: null
	};

	getLesson = async () => {
		this.setState({ loading: true });
		const lessonId = this.props.match.params.lessonId;
		try {
			const res = await axios.get(`api/lessons/${lessonId}`);
			this.setState({ loading: false, name: res.data.lesson.name });
		} catch (error) {
			this.setState({ loading: false });

			alert(error.response.data.error);
		}
	};
	writeHandler = e => {
		this.setState({ [e.target.name]: e.target.value });
	};
	addLessonHandler = async e => {
		e.preventDefault();
		this.setState({ loading: true });
		try {
			const addingResult = await axios.patch(`api/lessons/edit/lessonName`, {
				name: this.state.name,
				lessonId: this.props.match.params.lessonId
			});
			console.log('AddSubject -> addingResult', addingResult);
			let doneObj = { message: addingResult.data.message, type: 'success' };

			this.setState({ loading: false, doneObj: doneObj });
		} catch (error) {
			console.log(error.response.data.error);
			let doneObj = { message: error.response.data.error, type: 'error' };
			this.setState({ loading: false, doneObj: doneObj });
		}
	};
	componentDidMount() {
		this.getLesson();
	}
	render() {
		return (
			<Fragment>
				{!this.state.loading && (
					<div>
						<Intro logo='Class' thisCategory={`Edit Lesson ${this.state.name}`} />
						<form onSubmit={this.addLessonHandler}>
							<div lessonName='addForm'>
								<TextField
									id='outlined-basic'
									label='Lesson Name'
									variant='outlined'
									name='name'
									value={this.state.name}
									onChange={this.writeHandler}
									style={{ width: '100%' }}
									required
								/>
								<br />
								<br />
								<Button variant='contained' color='primary' type='submit'>
									Submit
								</Button>
							</div>
						</form>{' '}
					</div>
				)}
				<br />
				<br />
				{this.state.loading && <Loader />}
				{this.state.doneObj && <MyAlert message={this.state.doneObj.message} type={this.state.doneObj.type} />}
			</Fragment>
		);
	}
}

import React, { Component } from 'react';
import axios from 'axios';
import Loader from '../../UI/Loader/Loader';
import Intro from '../../Intro/Intro';
import ControlsBar from '../../ControlsBar/ControlsBar';
import MyTable from '../../Table/MyTable';

class Students extends Component {
	state = {
		loading: false,
		students: null,
		lessonId: '',
		lessons: [],
		searchText: ''
	};

	getStudents = async () => {
		try {
			this.setState({ loading: true });
			const res = await axios.get('api/students');
			this.setState({ loading: false, students: res.data.students });
		} catch (error) {
			console.log(error);
			this.setState({ loading: false });

			alert('error');
		}
	};

	goToAdd = () => {
		this.props.history.push('/Students/Add');
	};

	goToEdit = studentId => {
		this.props.history.push(`/Students/Edit/${studentId}`);
	};

	goToDetails = studentId => {
		this.props.history.push(`/Students/Details/${studentId}`);
	};
	delete = async (studentId, studentName) => {
		if (window.confirm(`Are you sure you want to delete a teacher with name ${studentName} ?`)) {
			try {
				await axios.delete(`api/student/delete/${studentId}`);
				this.getStudents();
			} catch (error) {
				console.log(error);
			}
		}
	};

	lessonChangeHandler = e => {
		this.setState({ lessonId: e.target.value });
	};

	addStudentToLessonHandler = async (e, studentId) => {
		e.preventDefault();
		this.setState({ loading: true });
		// get the lessonId from the state
		const lessonId = this.state.lessonId;
		try {
			const body = { lessonId: lessonId, studentId: studentId };
			await axios.patch('api/lesson/addStudent', body);
			this.getStudents();
		} catch (error) {
			alert(error.response.data.error);
			this.setState({ loading: false });
		}
	};

	getLessonesForSelecting = async () => {
		try {
			const res = await axios.get('api/lessons');
			this.setState({ lessons: res.data.lessons });
		} catch (error) {
			alert('error');
		}
	};
	searching = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	search = async () => {
		if (this.state.searchText === '') return alert('Please insert something');
		this.setState({ loading: true });
		try {
			const response = await axios.get(`api/students/search/${this.state.searchText}`);
			console.log('search -> res', response);
			this.setState({ loading: false });
			console.log(response.data.students);

			if (response.data.students.length < 1) {
				return alert('Students Not Found!');
			}
			this.setState({ students: response.data.students });
		} catch (error) {
			console.log('search -> error', error);
			alert(error.response.data.error);
		}
	};

	componentDidMount() {
		this.getLessonesForSelecting();
		this.getStudents();
	}
	render() {
		return (
			<div>
				<Intro thisCategory='Students' logo='People' />
				<ControlsBar
					searching={this.searching}
					search={this.search}
					thisCategory='Students'
					adding={true}
					goToAdd={this.goToAdd}
				/>
				{this.state.students && (
					<MyTable
						lessonId={this.state.lessonId}
						lessons={this.state.lessons}
						addStudentToLesson={this.addStudentToLessonHandler}
						lessonChangeHandler={this.lessonChangeHandler}
						students={true}
						view={true}
						options={true}
						heads={[ 'FullName', 'Email', 'Age', 'Gender', 'Joined-At' ]}
						body={[ 'email', 'age', 'gender', 'joinedAt' ]}
						items={this.state.students}
						deleteItem={this.delete}
						goToEdit={this.goToEdit}
						goToDetails={this.goToDetails}
					/>
				)}
				{this.state.loading && <Loader />}
			</div>
		);
	}
}

export default Students;

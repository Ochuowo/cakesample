import React, { Component } from 'react';
import Intro from '../Intro/Intro';
import MyTable from '../Table/MyTable';
import Loader from '../UI/Loader/Loader';
import axios from 'axios';

export default class ClassDetails extends Component {
	state = {
		loading: false,
		lessonObj: null
	};

	getLesson = async () => {
		try {
			this.setState({ loading: true });
			const lessonId = this.props.match.params.lessonId;

			const res = await axios.get(`api/lessons/${lessonId}`);
			console.log('SubjectDetails -> getLessons -> res', res);
			this.setState({ loading: false, lessonObj: res.data.lesson });
		} catch (error) {
			alert(error.response.data.error);
		}
	};

	removeStudentFromLesson = async (studentId, studentName) => {
		const lessonId = this.props.match.params.lessonId;
		try {
			if (
				window.confirm(`Are you sure you want to remove this student with the name ${studentName} from this lesson ?`)
			) {
				const body = { lessonId: lessonId, studentId: studentId };
				await axios.patch(`api/lessons/removeStudent`, body);
				this.getLesson();
			}
		} catch (error) {
			alert(error.response.data.error);
		}
	};
	componentDidMount() {
		this.getLesson();
	}
	render() {
		return (
			<div>
				{this.state.lessonObj && (
					<div>
						<Intro thisCategory={this.state.lessonObj.name} logo='Class' />
						{this.state.lessonObj.realStudents.length > 0 ? (
							<div>
								<h2 style={{ textAlign: 'center' }}>Lesson Students</h2>
								<MyTable
									removeStudentFromLesson={this.removeStudentFromLesson}
									removeStudent={true}
									items={this.state.lessonObj.realStudents}
									heads={[ 'FullName', 'Email', 'Age', 'Gender', 'Joined-At', 'Remove' ]}
									body={[ 'email', 'age', 'gender', 'joinedAt' ]}
								/>
							</div>
						) : (
							<h1 style={{ textAlign: 'center' }}>{`${this.state.lessonObj
								.name} Lesson has no students `}</h1>
						)}
					</div>
				)}
				{this.state.loading && <Loader />}
			</div>
		);
	}
}

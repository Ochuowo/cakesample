import React, { Fragment, useEffect, useState } from 'react';
import Boxes from '../../Boxes/Boxes';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Lessons = () => {
	const [state, setState] = useState({
		lessons: [],
		loading: false,
		searchText: '',
		isMounted: false
	});
	
	const history = useHistory();

	useEffect(() => {
		getLessons();
		console.log('component did mount');
	},[]);

	const getLessons = async () => {
		setState({ loading: true });
		try {
			const res = await axios.get(`api/lessons`);
			setState({ lessons: res.data.lessons, loading: false });
		} catch (error) {
			setState({ loading: false });
			console.log(error);
			alert('something went wrong, please try again later');
		}
	};

	const goToAdd = () => {
		history.push('/Lessons/Add');
	};

	const goToEdit = (lessonId) => {
		history.push(`/Lessons/Edit/${lessonId}`);
	};

	const handleDelete = async (lessonId, lessonName) => {
		if (window.confirm(`Do You want to delete a subject with name ${lessonName} ?`)) {
			try {
				await axios.delete(`/Lesson/delete/${lessonId}`);
				getLessons();
			} catch (error) {
				alert(error.response.data.error);
			}
		}
	};
	const searching = (e) => {
		setState({ [e.target.name]: e.target.value });
	};

	const search = async () => {
		if (state.searchText === '') return alert('Please insert something');
		setState({ loading: true });
		try {
			const res = await axios.get(`api/lessons/search/${state.searchText}`);
			setState({ loading: false });
			if (res.data.lessons.length < 1) {
				return alert('Lesson Not Found!');
			}
			setState({ lessons: res.data.lessons });
		} catch (error) {
			alert(error.response.data.error);
		}
	};

	const goToDetails = (lessonId) => {
		history.push(`api/lessons/Details/${lessonId}`);
	};
	
		return (
			<Fragment>
				<Boxes
					searching={searching}
					search={search}
					items={state.lessons}
					loading={state.loading}
					logo='Class'
					thisCategory='Lessons'
					goToAdd={goToAdd}
					goToEdit={goToEdit}
					goToDetails={goToDetails}
					delete={handleDelete}
				/>
			</Fragment>
		);
	
}

export default Lessons;

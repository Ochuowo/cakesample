import React from 'react';
import './About.scss';
function About() {
	return (
		<div id='About'>
			<h1 style={{ textAlign: 'center' }}>About The Academy</h1>
			<div className='row'>
				<div className='col-md-6'>
					<p>
					Always had a dream of owning a cake shop? Or knowing how to bake the perfect cake or the perfect cupcake? At Cakes.co.ke Academy, we want to walk with you and realize this dream. We a very large alumni of very successful students, who are taking the baking industry by storm. We look forward to walking with you.

					We have a new intake every month (1st Monday of the month)
					Our classes are flexible, fun and interactive
					Students carry home all the baked goods
					All ingredients, equipment, aprons, hair nets, recipe folder and class notes are provided (This is with the exception of decorating kits)
					Personalized classes with a maximum of 4 students per class for maximum attention to each student
					Ample, secure parking available for day and evening students
					Our next class schedules are outlined below:

					</p>
					<p>
					Basic Baking Class has spaces available (Mondays, Tuesdays, Wednesdays)
					Intermediate Baking Class has spaces available (Mondays, Tuesdays, Wednesdays)
					Advanced Baking Class has spaces available (Mondays, Tuesdays, Wednesdays)
					Kids Holiday Baking Classes has spaces available.

					</p>
				</div>
				<div className='col-md-6'>
					<p>
					Master Baking Class has spaces available (Mondays, Tuesdays, Wednesdays)
					Chocolate Art Master Class has spaces available1 (Mondays, Tuesdays, Wednesdays)
					Bread and Pastry Baking Class has spaces available (Mondays, Tuesdays, Wednesdays)
					Saturday Baking Classes are also available.
					See you in class!
					</p>
					<p>Click on any Class below to register online :)</p>
				</div>
			</div>
		</div>
	);
}

export default About;

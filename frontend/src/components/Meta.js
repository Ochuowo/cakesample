import React from 'react';
import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
	return (
		<Helmet>
			<title>{title}</title>
			<meta name='description' content={description} />
			<meta name='keywords' content={keywords} />
		</Helmet>
	);
};

Meta.defaultProps = {
	title: 'Welcome to Cakes.co.ke',
	keywords: 'Baking, Cakes.co.ke, Ecommerce, Waterland',
	description: 'A Cake for every occassion',
};
export default Meta;

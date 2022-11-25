import React from 'react';
import { Container } from 'react-bootstrap';
import '../styles/footer.css';

const Footer = () => {
	return (
		<Container>
			<footer className='footer-container'>
				<div className='footer-icons'>
					<a
						href='https://github.com/Ochuowo'
						aria-label='github account'
						target='_blank'
						rel='noopener noreferrer'>
						<i className='fab fa-github footer-icon' />
					</a>
					<a
						href='https://www.facebook.com/paul.ochuowo'
						aria-label='facebook account'
						target='_blank'
						rel='noopener noreferrer'>
						<i className='fab fa-facebook-square footer-icon' />
					</a>
					<a
						href='https://twitter.com/ochuowo'
						aria-label='twitter account'
						target='_blank'
						rel='noopener noreferrer'>
						<i className='fab fa-twitter footer-icon' />
					</a>
					<a
						href='www.linkedin.com/in/paul-ochuowo-08b93822'
						aria-label='developer portfolio'
						target='_blank'
						rel='noopener noreferrer'>
						<i className='fas fa-globe-asia footer-icon' />
					</a>
				</div>
				<div className='footer-copyright'>&copy;2022 WLEnt</div>
			</footer>
		</Container>
	);
};

export default Footer;

import passport from 'passport';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import generateGravatar from '../utils/generateGravatar.js';

// all passport strategies
import GoogleStrategy from 'passport-google-oauth20';
import GithubStrategy from 'passport-github2';
import TwitterStrategy from 'passport-twitter';
import FacebookStrategy from 'passport-facebook';

// to use .env variables in this file
dotenv.config();

const backendURL = process.env.BACKEND_BASE_URL;
const frontendURL = process.env.FRONTEND_BASE_URL;

// Funtion to send a flash message depending on which social account the user had originally registered with
const handleAuthError = (err, done) => {
	// we get the email from the option the user is currently trying to login with, and find the corresponding User obj
	User.findOne({
		email: err.keyValue.email, // err obj returned from mongoose has the keyValue key
	}).then((user) => {
		// check which socialID was stored in this User obj, return the corresponding error in format
		// done(null, false, {flash message}) -> which tells passport not to serialise this user
		if (user.googleID)
			return done(null, false, {
				message: 'Registered using google account',
			});
			console.log(message);
		if (user.githubID)
			return done(null, false, {
				message: 'Registered using github account',
			});
			console.log(message);
		if (user.twitterID)
			return done(null, false, {
				message: 'Registered using twitter account',
			});
			console.log(message);
		if (user.facebookID)
			return done(null, false, {
				message: 'Registered using facebook account',
			});
			console.log(message);
	});
};

// Include all passport strategies' setup in this function itself
const setupPassport = () => {
	// setup a session with the logged in user, by serialising this user as
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	// end the current login session after deserialising the user
	passport.deserializeUser((id, done) => {
		User.findById(id)
			.then((user) => done(null, user))
			.catch((err) => console.log(`${err}`.bgRed.bold));
	});

	// setup for the google strategy
	passport.use(
		new GoogleStrategy(
			{
				// options for the google strategy
				clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
				clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
				callbackURL: `${backendURL}/api/auth/google/callback`,
			},
			(accessToken, refreshToken, profile, done) => {
				// if a user with this google ID is present, serialise that user, otherwise create a new User
				User.findOne({ googleID: profile.id }).then((foundUser) => {
					if (!foundUser) {
						User.create({
							name: profile.displayName,
							isAdmin: false,
							isConfirmed: profile._json.email_verified,
							googleID: profile.id,
							email: profile._json.email,
							avatar: generateGravatar(profile._json.email), // gravatar is unique for all email IDs
						})
							.then((user) => {
								done(null, user);
							})
							.catch((err) => {
								// In case the User couldn't be created, this means that the email key was a duplicate
								// Which implies that the current email has already been registered using some different social account
								// So throw the corresponding flash message
								handleAuthError(err, done);
							});
					} else {
						done(null, foundUser);
					}
				});
			}
		)
	);

	// setup for the github strategy
	passport.use(
		new GithubStrategy(
			{
				// options for the github strategy
				clientID: process.env.GITHUB_CLIENT_ID,
				clientSecret: process.env.GITHUB_CLIENT_SECRET,
				callbackURL: `${frontendURL}/api/auth/github/callback`,
			},
			(accessToken, refreshToken, profile, done) => {
				// if a user with this github ID is present, serialise that user, otherwise create a new User
				User.findOne({ githubID: profile.id }).then((foundUser) => {
					if (!foundUser) {
						User.create({
							name: profile.displayName,
							isAdmin: false,
							isConfirmed: !!profile._json.email,
							githubID: profile.id,
							avatar: generateGravatar(profile._json.email),
							email: profile._json.email,
						})
							.then((user) => {
								done(null, user);
							})
							.catch((err) => {
								handleAuthError(err, done);
							});
					} else {
						done(null, foundUser);
					}
				});
			}
		)
	);
};

// setup for the twitter strategy
passport.use(
	new TwitterStrategy(
		{
			consumerKey: process.env.TWITTER_CONSUMER_KEY,	
			consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
			callbackURL: `${backendURL}/api/auth/twitter/callback`,
			includeEmail: true,
		},
		(accessToken, refreshToken, profile, done) => {
			User.findOne({ twitterID: profile.id }).then((foundUser) => {
				if (!foundUser) {
					User.create({
						name: profile.displayName,
						isAdmin: false,
						isConfirmed: true,
						twitterID: profile.id,
						avatar: generateGravatar(profile._json.email),
						email: profile._json.email,
					})
						.then((user) => {
							done(null, user);
						})
						.catch((err) => {
							handleAuthError(err, done);
						});
				} else {
					done(null, foundUser);
				}
			});
		}
	)
);

// setup for the facebook strategy
passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET,
			callbackURL: `${backendURL}/api/auth/facebook/callback`,
		},
		(accessToken, refreshToken, profile, done) => {
			User.findOne({ facebookID: profile.id }).then((foundUser) => {
				if (!foundUser) {
					User.create({
						name: profile.displayName,
						isAdmin: false,
						isConfirmed: true,
						facebookID: profile.id,
						email: profile.emails[0].value,
						avatar: generateGravatar(profile.emails[0].value),
					})
						.then((user) => {
							done(null, user);
						})
						.catch((err) => {
							handleAuthError(err, done);
						});
				} else {
					done(null, foundUser);
				}
			});
		}
	)
);

export default setupPassport;

import express from 'express';
import {
	passportLoginSuccess,
	passportLoginFailure,
} from '../controllers/authControllers.js';
import passport from 'passport';

const router = express.Router();

// @desc login user using the google strategy
// @route GET /api/auth/google
// @access PUBLIC
router.route('/google').get(
	// googleLogin,
	passport.authenticate('google', {
		scope: ['profile', 'email'],
	})
);

// @desc redirect route for the passport google strategy
// @route GET /api/auth/google/callback
// @access PUBLIC
router.route('/google/callback').get(
	passport.authenticate('google', {
		successRedirect: '/api/auth/google/callback/success',
		failureRedirect: '/api/auth/google/callback/failure',
		failureFlash: true,
	})
);

// @desc redirect route for the passport google strategy
// @route GET /api/auth/google/callback
// @access PUBLIC
router.route('/google/callback/success').get(passportLoginSuccess);

// @desc redirect route for the passport google strategy
// @route GET /api/auth/google/callback
// @access PUBLIC
router.route('/google/callback/failure').get(passportLoginFailure);

// @desc login user using the github strategy
// @route GET /api/auth/github
// @access PUBLIC
// githubLogin,
router.route('/github').get(
	passport.authenticate('github', {
		scope: ['user:email'],
	})
);

// @desc redirect route for the passport github strategy
// @route GET /api/auth/github/redirect
// @access PUBLIC
router.route('/github/callback').get(
	passport.authenticate('github', {
		successRedirect: '/api/auth/github/callback/success',
		failureRedirect: '/api/auth/github/callback/failure',
		failureFlash: true,
	})
);

// @desc redirect route for the passport github strategy
// @route GET /api/auth/github/redirect
// @access PUBLIC
router.route('/github/callback/success').get(passportLoginSuccess);

// @desc redirect route for the passport github strategy
// @route GET /api/auth/github/redirect
// @access PUBLIC
router.route('/github/callback/failure').get(passportLoginFailure);

// @desc redirect route for the passport twitter strategy
// @route GET /api/auth/twitter
// @access PUBLIC
router.route('/twitter').get(passport.authenticate('twitter'));

// @desc redirect route for the passport twitter strategy
// @route GET /api/auth/twitter/redirect
// @access PUBLIC
router.route('/twitter/callback').get(
	passport.authenticate('twitter', {
		successRedirect: '/api/auth/twitter/callback/success',
		failureRedirect: '/api/auth/twitter/callback/failure',
		failureFlash: true,
	})
);

// @desc redirect route for the passport twitter strategy
// @route GET /api/auth/twitter/redirect
// @access PUBLIC
router.route('/twitter/callback/success').get(passportLoginSuccess);

// @desc redirect route for the passport twitter strategy
// @route GET /api/auth/twitter/redirect
// @access PUBLIC
router.route('/twitter/callback/failure').get(passportLoginFailure);

// @desc redirect route for the passport facebook strategy
// @route GET /api/auth/facebook/
// @access PUBLIC
router.route('/facebook').get(
	passport.authenticate('facebook',
{ scope: ['user_friends', 'manage_pages'] }));

// @desc redirect route for the passport facebook strategy
// @route GET /api/auth/facebook/redirect
// @access PUBLIC
router.route('/facebook/callback').get(
	passport.authenticate('facebook', {
		successRedirect: '/api/auth/facebook/callback/success',
		failureRedirect: '/api/auth/facebook/callback/failure',
		failureFlash: true,
	})
);

// @desc redirect route for the passport facebook strategy
// @route GET /api/auth/facebook/redirect
// @access PUBLIC
router.route('/facebook/callback/success').get(passportLoginSuccess);

// @desc redirect route for the passport facebook strategy
// @route GET /api/auth/facebook/redirect
// @access PUBLIC
router.route('/facebook/callback/failure').get(passportLoginFailure);

export default router;

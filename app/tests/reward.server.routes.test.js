'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Reward = mongoose.model('Reward'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, reward;

/**
 * Reward routes tests
 */
describe('Reward CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Reward
		user.save(function() {
			reward = {
				name: 'Reward Name'
			};

			done();
		});
	});

	it('should be able to save Reward instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reward
				agent.post('/rewards')
					.send(reward)
					.expect(200)
					.end(function(rewardSaveErr, rewardSaveRes) {
						// Handle Reward save error
						if (rewardSaveErr) done(rewardSaveErr);

						// Get a list of Rewards
						agent.get('/rewards')
							.end(function(rewardsGetErr, rewardsGetRes) {
								// Handle Reward save error
								if (rewardsGetErr) done(rewardsGetErr);

								// Get Rewards list
								var rewards = rewardsGetRes.body;

								// Set assertions
								(rewards[0].user._id).should.equal(userId);
								(rewards[0].name).should.match('Reward Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Reward instance if not logged in', function(done) {
		agent.post('/rewards')
			.send(reward)
			.expect(401)
			.end(function(rewardSaveErr, rewardSaveRes) {
				// Call the assertion callback
				done(rewardSaveErr);
			});
	});

	it('should not be able to save Reward instance if no name is provided', function(done) {
		// Invalidate name field
		reward.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reward
				agent.post('/rewards')
					.send(reward)
					.expect(400)
					.end(function(rewardSaveErr, rewardSaveRes) {
						// Set message assertion
						(rewardSaveRes.body.message).should.match('Please fill Reward name');
						
						// Handle Reward save error
						done(rewardSaveErr);
					});
			});
	});

	it('should be able to update Reward instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reward
				agent.post('/rewards')
					.send(reward)
					.expect(200)
					.end(function(rewardSaveErr, rewardSaveRes) {
						// Handle Reward save error
						if (rewardSaveErr) done(rewardSaveErr);

						// Update Reward name
						reward.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Reward
						agent.put('/rewards/' + rewardSaveRes.body._id)
							.send(reward)
							.expect(200)
							.end(function(rewardUpdateErr, rewardUpdateRes) {
								// Handle Reward update error
								if (rewardUpdateErr) done(rewardUpdateErr);

								// Set assertions
								(rewardUpdateRes.body._id).should.equal(rewardSaveRes.body._id);
								(rewardUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Rewards if not signed in', function(done) {
		// Create new Reward model instance
		var rewardObj = new Reward(reward);

		// Save the Reward
		rewardObj.save(function() {
			// Request Rewards
			request(app).get('/rewards')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Reward if not signed in', function(done) {
		// Create new Reward model instance
		var rewardObj = new Reward(reward);

		// Save the Reward
		rewardObj.save(function() {
			request(app).get('/rewards/' + rewardObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', reward.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Reward instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reward
				agent.post('/rewards')
					.send(reward)
					.expect(200)
					.end(function(rewardSaveErr, rewardSaveRes) {
						// Handle Reward save error
						if (rewardSaveErr) done(rewardSaveErr);

						// Delete existing Reward
						agent.delete('/rewards/' + rewardSaveRes.body._id)
							.send(reward)
							.expect(200)
							.end(function(rewardDeleteErr, rewardDeleteRes) {
								// Handle Reward error error
								if (rewardDeleteErr) done(rewardDeleteErr);

								// Set assertions
								(rewardDeleteRes.body._id).should.equal(rewardSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Reward instance if not signed in', function(done) {
		// Set Reward user 
		reward.user = user;

		// Create new Reward model instance
		var rewardObj = new Reward(reward);

		// Save the Reward
		rewardObj.save(function() {
			// Try deleting Reward
			request(app).delete('/rewards/' + rewardObj._id)
			.expect(401)
			.end(function(rewardDeleteErr, rewardDeleteRes) {
				// Set message assertion
				(rewardDeleteRes.body.message).should.match('User is not logged in');

				// Handle Reward error error
				done(rewardDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Reward.remove().exec();
		done();
	});
});
'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Schoolclass = mongoose.model('Schoolclass');

/**
 * Globals
 */
var user, schoolclass;

/**
 * Unit tests
 */
describe('Schoolclass Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			schoolclass = new Schoolclass({
				name: 'Schoolclass Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return schoolclass.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			schoolclass.name = '';

			return schoolclass.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Schoolclass.remove().exec();
		User.remove().exec();

		done();
	});
});
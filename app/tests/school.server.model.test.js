'use strict';

/**
* Module dependencies.
*/
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	School = mongoose.model('School');

/**
* Globals
*/
var user, school;

/**
* Unit tests
*/
describe('School Model Unit Tests:', function() {
	beforeEach(function(done) {

        if (process.env.NODE_ENV !== 'test') {
            should.fail('process.env.NODE_ENV !== \'test\'',
                'process.env.NODE_ENV === \'test\'',
                'This test should run in a test environment');
            return;
        }

		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
            inventory: [],
			provider: 'provider'
		});

		user.save(function() {
			school = new School({
				name: 'School Name',
                country: 'UK',
                city: 'Cambridge',
				user: user
			});
			done();
		});
	});

	describe('Method Save', function() {

        //it('should add the school to studentInSchools of the user', function(done) {
        //
        //
        //    //school.save();
        //    school.students.push(user._id);
			//school.save(function() {
			//	User.findById(user._id, function (err, user) {
			//		should.not.exist(err);
			//		user.studentInSchools.should.include(school._id);
			//	});
			//});
        //});

		it('should be able to save without problems', function(done) {
			return school.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) {
			school.name = '';

			return school.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {

        if (process.env.NODE_ENV !== 'test') {
            should.fail('process.env.NODE_ENV !== \'test\'',
                'process.env.NODE_ENV === \'test\'',
                'This test should run in a test environment');
            return;
        }

		School.remove().exec();
		User.remove().exec();

		done();
	});
});

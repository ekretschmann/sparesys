'use strict';

/**
* Module dependencies.
*/
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Reward = mongoose.model('Reward');

/**
* Globals
*/
var user, reward;

/**
* Unit tests
*/
describe('Reward Model Unit Tests:', function() {


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
            inventory: []
		});

		user.save(function() {
			reward = new Reward({
				name: 'Reward Name',
                description: 'Reward Description',
                type: 'Item',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return reward.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should show an error when try to save without name', function(done) {
			reward.name = '';

			return reward.save(function(err) {
				should.exist(err);
				done();
			});
		});

        it('should show an error when try to save without description', function(done) {
            reward.description = '';

            return reward.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should show an error when try to save without type', function(done) {
            reward.type = '';

            return reward.save(function(err) {
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

		Reward.remove().exec();
		User.remove().exec();

		done();
	});
});

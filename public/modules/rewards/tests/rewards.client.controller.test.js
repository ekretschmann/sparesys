'use strict';

(function() {
	// Rewards Controller Spec
	describe('Rewards Controller Tests', function() {
		// Initialize global variables
		var RewardsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Rewards controller.
			RewardsController = $controller('RewardsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Reward object fetched from XHR', inject(function(Rewards) {
			// Create sample Reward using the Rewards service
			var sampleReward = new Rewards({
				name: 'New Reward'
			});

			// Create a sample Rewards array that includes the new Reward
			var sampleRewards = [sampleReward];

			// Set GET response
			$httpBackend.expectGET('rewards').respond(sampleRewards);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rewards).toEqualData(sampleRewards);
		}));

		it('$scope.findOne() should create an array with one Reward object fetched from XHR using a rewardId URL parameter', inject(function(Rewards) {
			// Define a sample Reward object
			var sampleReward = new Rewards({
				name: 'New Reward'
			});

			// Set the URL parameter
			$stateParams.rewardId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/rewards\/([0-9a-fA-F]{24})$/).respond(sampleReward);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.reward).toEqualData(sampleReward);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Rewards) {
			// Create a sample Reward object
			var sampleRewardPostData = new Rewards({
				name: 'New Reward'
			});

			// Create a sample Reward response
			var sampleRewardResponse = new Rewards({
				_id: '525cf20451979dea2c000001',
				name: 'New Reward'
			});

			// Fixture mock form input values
			scope.name = 'New Reward';

			// Set POST response
			$httpBackend.expectPOST('rewards', sampleRewardPostData).respond(sampleRewardResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Reward was created
			expect($location.path()).toBe('/rewards/' + sampleRewardResponse._id);
		}));

		it('$scope.update() should update a valid Reward', inject(function(Rewards) {
			// Define a sample Reward put data
			var sampleRewardPutData = new Rewards({
				_id: '525cf20451979dea2c000001',
				name: 'New Reward'
			});

			// Mock Reward in scope
			scope.reward = sampleRewardPutData;

			// Set PUT response
			$httpBackend.expectPUT(/rewards\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/rewards/' + sampleRewardPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid rewardId and remove the Reward from the scope', inject(function(Rewards) {
			// Create new Reward object
			var sampleReward = new Rewards({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Rewards array and include the Reward
			scope.rewards = [sampleReward];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/rewards\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleReward);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.rewards.length).toBe(0);
		}));
	});
}());
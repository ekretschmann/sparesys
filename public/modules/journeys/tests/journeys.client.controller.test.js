'use strict';

(function() {
	// Journeys Controller Spec
	describe('Journeys Controller Tests', function() {
		// Initialize global variables
		var JourneysController,
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

			// Initialize the Journeys controller.
			JourneysController = $controller('JourneysController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Journey object fetched from XHR', inject(function(Journeys) {
			// Create sample Journey using the Journeys service
			var sampleJourney = new Journeys({
				name: 'New Journey'
			});

			// Create a sample Journeys array that includes the new Journey
			var sampleJourneys = [sampleJourney];

			// Set GET response
			$httpBackend.expectGET('journeys').respond(sampleJourneys);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.journeys).toEqualData(sampleJourneys);
		}));

		it('$scope.findOne() should create an array with one Journey object fetched from XHR using a journeyId URL parameter', inject(function(Journeys) {
			// Define a sample Journey object
			var sampleJourney = new Journeys({
				name: 'New Journey'
			});

			// Set the URL parameter
			$stateParams.journeyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/journeys\/([0-9a-fA-F]{24})$/).respond(sampleJourney);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.journey).toEqualData(sampleJourney);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Journeys) {
			// Create a sample Journey object
			var sampleJourneyPostData = new Journeys({
				name: 'New Journey'
			});

			// Create a sample Journey response
			var sampleJourneyResponse = new Journeys({
				_id: '525cf20451979dea2c000001',
				name: 'New Journey'
			});

			// Fixture mock form input values
			scope.name = 'New Journey';

			// Set POST response
			$httpBackend.expectPOST('journeys', sampleJourneyPostData).respond(sampleJourneyResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Journey was created
			expect($location.path()).toBe('/journeys/' + sampleJourneyResponse._id);
		}));

		it('$scope.update() should update a valid Journey', inject(function(Journeys) {
			// Define a sample Journey put data
			var sampleJourneyPutData = new Journeys({
				_id: '525cf20451979dea2c000001',
				name: 'New Journey'
			});

			// Mock Journey in scope
			scope.journey = sampleJourneyPutData;

			// Set PUT response
			$httpBackend.expectPUT(/journeys\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/journeys/' + sampleJourneyPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid journeyId and remove the Journey from the scope', inject(function(Journeys) {
			// Create new Journey object
			var sampleJourney = new Journeys({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Journeys array and include the Journey
			scope.journeys = [sampleJourney];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/journeys\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleJourney);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.journeys.length).toBe(0);
		}));
	});
}());
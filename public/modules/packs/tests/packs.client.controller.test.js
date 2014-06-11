'use strict';

(function() {
	// Packs Controller Spec
	describe('Packs Controller Tests', function() {
		// Initialize global variables
		var PacksController,
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

			// Initialize the Packs controller.
			PacksController = $controller('PacksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Pack object fetched from XHR', inject(function(Packs) {
			// Create sample Pack using the Packs service
			var samplePack = new Packs({
				name: 'New Pack'
			});

			// Create a sample Packs array that includes the new Pack
			var samplePacks = [samplePack];

			// Set GET response
			$httpBackend.expectGET('packs').respond(samplePacks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.packs).toEqualData(samplePacks);
		}));

		it('$scope.findOne() should create an array with one Pack object fetched from XHR using a packId URL parameter', inject(function(Packs) {
			// Define a sample Pack object
			var samplePack = new Packs({
				name: 'New Pack'
			});

			// Set the URL parameter
			$stateParams.packId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/packs\/([0-9a-fA-F]{24})$/).respond(samplePack);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pack).toEqualData(samplePack);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Packs) {
			// Create a sample Pack object
			var samplePackPostData = new Packs({
				name: 'New Pack'
			});

			// Create a sample Pack response
			var samplePackResponse = new Packs({
				_id: '525cf20451979dea2c000001',
				name: 'New Pack'
			});

			// Fixture mock form input values
			scope.name = 'New Pack';

			// Set POST response
			$httpBackend.expectPOST('packs', samplePackPostData).respond(samplePackResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Pack was created
			expect($location.path()).toBe('/packs/' + samplePackResponse._id);
		}));

		it('$scope.update() should update a valid Pack', inject(function(Packs) {
			// Define a sample Pack put data
			var samplePackPutData = new Packs({
				_id: '525cf20451979dea2c000001',
				name: 'New Pack'
			});

			// Mock Pack in scope
			scope.pack = samplePackPutData;

			// Set PUT response
			$httpBackend.expectPUT(/packs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/packs/' + samplePackPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid packId and remove the Pack from the scope', inject(function(Packs) {
			// Create new Pack object
			var samplePack = new Packs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Packs array and include the Pack
			scope.packs = [samplePack];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/packs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePack);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.packs.length).toBe(0);
		}));
	});
}());
'use strict';

(function() {
	// Schoolclasses Controller Spec
	describe('Schoolclasses Controller Tests', function() {
		// Initialize global variables
		var SchoolclassesController,
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

			// Initialize the Schoolclasses controller.
			SchoolclassesController = $controller('SchoolclassesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Schoolclass object fetched from XHR', inject(function(Schoolclasses) {
			// Create sample Schoolclass using the Schoolclasses service
			var sampleSchoolclass = new Schoolclasses({
				name: 'New Schoolclass'
			});

			// Create a sample Schoolclasses array that includes the new Schoolclass
			var sampleSchoolclasses = [sampleSchoolclass];

			// Set GET response
			$httpBackend.expectGET('schoolclasses').respond(sampleSchoolclasses);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.schoolclasses).toEqualData(sampleSchoolclasses);
		}));

		it('$scope.findOne() should create an array with one Schoolclass object fetched from XHR using a schoolclassId URL parameter', inject(function(Schoolclasses) {
			// Define a sample Schoolclass object
			var sampleSchoolclass = new Schoolclasses({
				name: 'New Schoolclass'
			});

			// Set the URL parameter
			$stateParams.schoolclassId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/schoolclasses\/([0-9a-fA-F]{24})$/).respond(sampleSchoolclass);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.schoolclass).toEqualData(sampleSchoolclass);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Schoolclasses) {
			// Create a sample Schoolclass object
			var sampleSchoolclassPostData = new Schoolclasses({
				name: 'New Schoolclass'
			});

			// Create a sample Schoolclass response
			var sampleSchoolclassResponse = new Schoolclasses({
				_id: '525cf20451979dea2c000001',
				name: 'New Schoolclass'
			});

			// Fixture mock form input values
			scope.name = 'New Schoolclass';

			// Set POST response
			$httpBackend.expectPOST('schoolclasses', sampleSchoolclassPostData).respond(sampleSchoolclassResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Schoolclass was created
			expect($location.path()).toBe('/schoolclasses/' + sampleSchoolclassResponse._id);
		}));

		it('$scope.update() should update a valid Schoolclass', inject(function(Schoolclasses) {
			// Define a sample Schoolclass put data
			var sampleSchoolclassPutData = new Schoolclasses({
				_id: '525cf20451979dea2c000001',
				name: 'New Schoolclass'
			});

			// Mock Schoolclass in scope
			scope.schoolclass = sampleSchoolclassPutData;

			// Set PUT response
			$httpBackend.expectPUT(/schoolclasses\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/schoolclasses/' + sampleSchoolclassPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid schoolclassId and remove the Schoolclass from the scope', inject(function(Schoolclasses) {
			// Create new Schoolclass object
			var sampleSchoolclass = new Schoolclasses({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Schoolclasses array and include the Schoolclass
			scope.schoolclasses = [sampleSchoolclass];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/schoolclasses\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSchoolclass);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.schoolclasses.length).toBe(0);
		}));
	});
}());
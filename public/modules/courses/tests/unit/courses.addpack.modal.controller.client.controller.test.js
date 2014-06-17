//'use strict';
//
//(function() {
//	// Delete course modal controller Controller Spec
//	describe('Delete course modal controller Controller Tests', function() {
//		// Initialize global variables
//		var DeleteCourseModalControllerController,
//			scope,
//			$httpBackend,
//			$stateParams,
//			$location,
//            modalInstance;
//
//		// The $resource service augments the response object with methods for updating and deleting the resource.
//		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
//		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
//		// When the toEqualData matcher compares two objects, it takes only object properties into
//		// account and ignores methods.
//		beforeEach(function() {
//			jasmine.addMatchers({
//				toEqualData: function(util, customEqualityTesters) {
//					return {
//						compare: function(actual, expected) {
//							return {
//								pass: angular.equals(actual, expected)
//							};
//						}
//					};
//				}
//			});
//		});
//
//		// Then we can start by loading the main application module
//		beforeEach(module(ApplicationConfiguration.applicationModuleName));
//
//		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
//		// This allows us to inject a service but then attach it to a variable
//		// with the same name as the service.
//		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _$modalInstance_) {
//			// Set a new global scope
//			scope = $rootScope.$new();
//
//			// Point global variables to injected services
//			$stateParams = _$stateParams_;
//			$httpBackend = _$httpBackend_;
//			$location = _$location_;
//			modalInstance = _$modalInstance_;
//
//			// Initialize the Delete course modal controller controller.
//			DeleteCourseModalControllerController = $controller('DeleteCourseModalControllerController', {
//				$scope: scope,
//                $modalInstance: modalInstance
//			});
//		}));
//
//		it('Should do some controller test', inject(function() {
//			// The test logic
//			// ...
//		}));
//	});
//}());
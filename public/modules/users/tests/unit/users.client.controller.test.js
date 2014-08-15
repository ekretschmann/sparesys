//'use strict';
//
//(function() {
//	// Users Controller Spec
//	describe('Users Controller Tests', function() {
//		// Initialize global variables
//		var UsersController,
//			scope,
//			$httpBackend,
//			$stateParams,
//			$location;
//
//		// The $resource service augments the response object with methods for updating and deleting the resource.
//		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
//		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
//		// When the toEqualData matcher compares two objects, it takes only object properties into
//		// account and ignores methods.
//		beforeEach(function() {
//			jasmine.addMatchers({
//				toEqualData: function() {
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
//		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
//			// Set a new global scope
//			scope = $rootScope.$new();
//
//			// Point global variables to injected services
//			$stateParams = _$stateParams_;
//			$httpBackend = _$httpBackend_;
//			$location = _$location_;
//
//			// Initialize the Users controller.
//			UsersController = $controller('UsersController', {
//				$scope: scope
//			});
//		}));
//
//		it('$scope.find() should create an array with at least one User object fetched from XHR', inject(function(Users) {
//			// Create sample User using the Users service
//			var sampleUser = new Users({
//				firstName: 'John'
//			});
//
//			// Create a sample Users array that includes the new User
//			var sampleUsers = [sampleUser];
//
//			// Set GET response
//			$httpBackend.expectGET('users').respond(sampleUsers);
//
//			// Run controller functionality
//			scope.find();
//			$httpBackend.flush();
//
//			// Test scope value
//			expect(scope.users).toEqualData(sampleUsers);
//            expect('x').toEqualData('x');
//		}));
//
//		it('$scope.findOne() should create an array with one User object fetched from XHR using a courseId URL parameter', inject(function(Users) {
//			// Define a sample User object
//			var sampleUser = new Users({
//                firstName: 'John'
//			});
//
//			// Set the URL parameter
//			$stateParams.userId = '525a8422f6d0f87f0e407a33';
//
//			// Set GET response
//			$httpBackend.expectGET(/users\/([0-9a-fA-F]{24})$/).respond(sampleUser);
//
//			// Run controller functionality
//			scope.findOne();
//			$httpBackend.flush();
//
//			// Test scope value
//			expect(scope.otherUser).toEqualData(sampleUser);
//		}));
//
//		it('$scope.update() should update a valid User and go back to the User List view', inject(function(Users) {
//
//            scope.otherUser =  new Users({
//                _id: '525cf20451979dea2c000001',
//                firstName: 'John'
//            });
//
//			// Set PUT response
//			$httpBackend.expectPUT(/users\/([0-9a-fA-F]{24})$/).respond();
//
//			// Run controller functionality
//			scope.update();
//			$httpBackend.flush();
//
//			// Test URL location to new object
//			expect($location.path()).toBe('/users');
//		}));
//
//		it('$scope.remove() should send a DELETE request with a valid userId and go back to the User List view', inject(function(Users) {
//			// Create new User object
//			var sampleUser = new Users({
//				_id: '525a8422f6d0f87f0e407a33'
//			});
//
//			// Set expected DELETE response
//			$httpBackend.expectDELETE(/users\/([0-9a-fA-F]{24})$/).respond(204);
//
//			// Run controller functionality
//			scope.remove(sampleUser);
//			$httpBackend.flush();
//
//            // Test URL location to new object
//            expect($location.path()).toBe('/users');
//		}));
//
//        it('$scope.toggleSelection("admin") should take away the admin role from an admin user', inject(function(Users) {
//
//            var sampleUser = new Users({
//                roles: ['admin', 'user']
//            });
//
//            scope.otherUser = sampleUser;
//            scope.toggleSelection('admin');
//            expect(sampleUser.roles.indexOf('admin')).toBe(-1);
//        }));
//
//        it('$scope.toggleSelection("admin") should give the admin role to a non-admin user', inject(function(Users) {
//
//            var sampleUser = new Users({
//                roles: ['user']
//            });
//
//            scope.otherUser = sampleUser;
//            scope.toggleSelection('admin');
//            expect(sampleUser.roles.indexOf('admin')).not.toBe(-1);
//        }));
//
//    });
//}());
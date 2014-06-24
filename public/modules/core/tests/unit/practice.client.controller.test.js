'use strict';

(function() {
    describe('PracticeController', function() {
        //Initialize global variables
        var scope,
            HomeController;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function($controller, $rootScope) {
            scope = $rootScope.$new();

            HomeController = $controller('PracticeController', {
                $scope: scope
            });
        }));

        it('should expose the authentication service', function() {
            expect(scope.authentication).toBeTruthy();
        });
    });
})();
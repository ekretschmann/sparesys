'use strict';


// Courses controller
angular.module('core').controller('TestDataController',
    ['$scope', '$state', 'TestDataService',
        function ($scope, $state, TestDataService) {

            $scope.createDummyCourse = function() {

                TestDataService.createDummmyCourse(function() {
                    $state.go($state.$current, null, { reload: true });
                });
            };
        }
    ]);
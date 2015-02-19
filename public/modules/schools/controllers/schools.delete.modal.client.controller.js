'use strict';

angular.module('schools').controller('DeleteSchoolModalController', ['$scope', '$state', '$location', '$modalInstance', 'school', 'Schools', 'Schoolclasses', 'Authentication',
    function ($scope, $state, $location, $modalInstance, school, Schools, Schoolclasses, Authentication) {
        $scope.school = school;
        $scope.authentication = Authentication;

        $scope.ok = function () {

            school.schoolclasses.forEach(function(schoolclass) {
                new Schoolclasses(schoolclass).$remove();
            });

            new Schools(school).$remove(function() {
                $state.go($state.current, null, { reload: true});
            });

            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
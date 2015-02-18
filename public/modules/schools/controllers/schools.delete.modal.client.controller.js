'use strict';

angular.module('schools').controller('DeleteSchoolModalController', ['$scope', '$state', '$location', '$modalInstance', 'school', 'Schools', 'Schoolclasses', 'Authentication',
    function ($scope, $state, $location, $modalInstance, school, Schools, Schoolclasses, Authentication) {
        $scope.school = school;
        $scope.authentication = Authentication;

        $scope.ok = function () {

            console.log(school);
            var id = school._id;
            school.schoolclasses.forEach(function(schoolclass) {
                console.log(schoolclass);
            });
            //school.$remove();

            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
'use strict';

angular.module('schools').controller('DeleteSchoolModalController', ['$scope', '$state','$location', '$modalInstance', 'school', 'Schools', 'Schoolclasses', 'Authentication',
	function($scope, $state, $location, $modalInstance, school, Schools, Schoolclasses, Authentication) {
        $scope.school = school;
        $scope.authentication = Authentication;

        $scope.ok = function () {

            // TODO: FURTHER CLEANUP WITH TEACHERS AND STUDENTS
            school.schoolclasses.forEach(function(schoolclassId){
                Schoolclasses.get({
                    schoolclassId: schoolclassId
                }, function(schoolclass) {

                    schoolclass.$remove();
                });
            });

            school.$remove(function () {
                $state.go($state.$current, null, { reload: true });
                $location.path('schools/admin');
            });


            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);
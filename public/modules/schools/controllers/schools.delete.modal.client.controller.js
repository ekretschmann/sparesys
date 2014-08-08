'use strict';

angular.module('schools').controller('DeleteSchoolModalController', ['$scope', '$location', '$modalInstance', 'school', 'Schools', 'Schoolclasses', 'Authentication',
	function($scope, $location, $modalInstance, school, Schools, Schoolclasses, Authentication) {
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
                $location.path('schools/manage');
            });


            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);
'use strict';

angular.module('schools').controller('DeleteSchoolModalController', ['$scope', '$state', '$location', '$modalInstance', 'school', 'Schools', 'Schoolclasses', 'Authentication',
    function ($scope, $state, $location, $modalInstance, school, Schools, Schoolclasses, Authentication) {
        $scope.school = school;
        $scope.authentication = Authentication;

        $scope.ok = function () {

            var id = school._id;

            school.$remove(function () {


                for (var i in $scope.authentication.user.administersSchools) {
                    if ($scope.authentication.user.administersSchools[i] === school._id) {
                        $scope.authentication.user.administersSchools.splice(i, 1);
                    }
                }

                if ($state.current.url === '/schools/:schoolId/edit') {
                    $location.path('/');
                    $state.go('home', null, { reload: true });
                    $modalInstance.close();
                }
                //
//                $location.path('schools/admin');
            });


        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
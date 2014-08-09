'use strict';

angular.module('schools').controller('SubscribeToSchoolModalController', ['$scope', '$location', '$modalInstance', 'Authentication', 'school',
    function ($scope, $location, $modalInstance, Authentication, school) {

        $scope.authentication = Authentication;
        $scope.school = school;

        $scope.ok = function () {

            if ($scope.options.asStudent) {
                if (school.students.indexOf($scope.authentication.user._id) === -1) {
                    school.students.push($scope.authentication.user._id);
                    school.$update();
                }
            }

//            school.$remove(school, function () {
//
//                $location.path('schools/manage');
//            });

            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
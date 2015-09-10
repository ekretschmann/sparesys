'use strict';

angular.module('schools').controller('UnsubscribeStudentModalController', ['$scope', '$location', '$window','$modalInstance', 'Authentication', 'Users', 'school', 'user',
    function ($scope, $location, $window, $modalInstance, Authentication, Users, school, user) {

        $scope.school = school;
        $scope.user = user;

        $scope.ok = function () {

            Users.get({
                userId: $scope.user._id
            }, function (result) {

                result.studentInSchools.splice(result.studentInSchools.indexOf($scope.school._id), 1);
                result.$update(function() {
                    $scope.user.studentInSchools.splice($scope.user.studentInSchools.indexOf($scope.school._id), 1);
                    $modalInstance.close();
                });
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
'use strict';

angular.module('schools').controller('SubscribeTeacherModalController', ['$scope', '$window', '$location', '$modalInstance', 'Authentication', 'Users', 'school', 'user',
    function ($scope, $window, $location, $modalInstance, Authentication, Users, school, user) {

        //$scope.authentication = Authentication;
        $scope.school = school;
        $scope.user = user;

        $scope.ok = function () {


            Users.get({
                userId: user._id
            }, function (result) {

                result.teacherInSchools.push($scope.school._id);
                result.$update(function () {
                    $scope.user.teacherInSchools.push($scope.school._id);
                    $modalInstance.close();
                });
            });


        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
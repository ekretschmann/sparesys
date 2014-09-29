'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$state', '$modalInstance', 'Users', 'Authentication', 'user',
    function ($scope, $state, $modalInstance, Users, Authentication, user) {

        $scope.roleSettings = {};
        $scope.roleSettings.teacher = user.roles.indexOf('teacher') > -1;
        $scope.roleSettings.headmaster = user.roles.indexOf('headmaster') > -1;

        Users.get({
            userId: user._id
        }, function (result) {
                $scope.user = result;
            Authentication.user = result;
        });

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        // Update a user profile
        $scope.ok = function () {

            var teacher = $scope.roleSettings.teacher;
            var headmaster = $scope.roleSettings.headmaster;

            if (teacher === true) {
                if ($scope.user.roles.indexOf('teacher')<0) {
                    $scope.user.roles.push('teacher');
                }
            } else {
                for (var i in $scope.user.roles) {

                    if ($scope.user.roles[i] === 'teacher') {
                        $scope.user.roles.splice(i, 1);
                    }
                }
            }

            if (headmaster === true) {
                if ($scope.user.roles.indexOf('headmaster')<0) {
                    $scope.user.roles.push('headmaster');
                }
            } else {
                for (var j in $scope.user.roles) {
                    if ($scope.user.roles[j] === 'headmaster') {
                        $scope.user.roles.splice(j, 1);
                    }
                }
            }



            $scope.user.$update(function() {
                $modalInstance.close();
            });
        };


    }
]);
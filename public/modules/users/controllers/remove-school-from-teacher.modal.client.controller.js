'use strict';

angular.module('schools').controller('RemoveSchoolFromTeacherModalController', ['$scope', '$state', '$location', '$modalInstance', 'school', 'user',
    function ($scope, $state, $location, $modalInstance, school, user) {
        $scope.school = school;
        $scope.user = user;

        $scope.ok = function () {



            for (var i=0; i<=user.teacherInSchools.length; i++) {
                if (user.teacherInSchools[i] === school._id) {
                    user.teacherInSchools.splice(i, 1);
                }
            }

            user.$update(function() {
                $modalInstance.close();
            });


        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);

'use strict';

angular.module('schools').controller('RemoveSchoolFromStudentModalController', ['$scope', '$state', '$location', '$modalInstance', 'school', 'user',
    function ($scope, $state, $location, $modalInstance, school, user) {
        $scope.school = school;
        $scope.user = user;

        $scope.ok = function () {



            console.log(user.studentInSchools);
            console.log(school);
            for (var i=0; i<=user.studentInSchools.length; i++) {
                if (user.studentInSchools[i] === school) {
                    user.studentInSchools.splice(i, 1);
                }
            }
            console.log(user.studentInSchools);

            user.$update(function() {
                $modalInstance.close();
            });



        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);

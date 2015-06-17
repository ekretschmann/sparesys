'use strict';

angular.module('schools').controller('UnsubscribeStudentModalController', ['$scope', '$location', '$window','$modalInstance', 'Authentication', 'Users', 'school',
    function ($scope, $location, $window, $modalInstance, Authentication, Users, school) {

        $scope.authentication = Authentication;
        $scope.school = school;

        $scope.ok = function () {

            for (var i in school.students) {
                if (school.students[i] === $scope.authentication.user._id) {
                    school.students.splice(i, 1);
                }
            }
            school.$update();

            console.log('/schools/unsubscribe/student/:id');
            if ($window.ga) {
                console.log('sending to ga');
                $window.ga('send', 'pageview', '/schools/unsubscribe/student/:id');
                $window.ga('send', 'event', 'user unsubscribes from a school as student');
            }

            var idx = $scope.authentication.user.studentInSchools.indexOf(school._id);
            if(idx > -1) {
                $scope.authentication.user.studentInSchools.splice(idx, 1);
            }

            Users.get({
                userId: $scope.authentication.user._id
            }, function (result) {
                result.studentInSchools = $scope.authentication.user.studentInSchools;
                result.$update(function(updatedUser) {
                    Authentication.user = updatedUser;
                });

            });


            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
'use strict';

angular.module('schools').controller('SubscribeStudentModalController', ['$scope', '$location', '$window','$modalInstance', 'Authentication', 'Users', 'school',
    function ($scope, $location, $window, $modalInstance, Authentication, Users, school) {

        $scope.authentication = Authentication;
        $scope.school = school;

        $scope.ok = function () {

            $scope.school.students.push($scope.authentication.user._id);
            $scope.school.$update();

            console.log('ga student subscribes to school');
            console.log('/schools/subscribe/student/:id');
            if ($window.ga) {
                console.log('sending to ga');
                $window.ga('send', 'pageview', '/schools/subscribe/student/:id');
                $window.ga('send', 'event', 'user subscribes to a school as student');
            }

            // should be solved server sided with a rest call, really
            if ($scope.authentication.user.studentInSchools.indexOf($scope.school._id) === -1) {
                $scope.authentication.user.studentInSchools.push($scope.school._id);
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
